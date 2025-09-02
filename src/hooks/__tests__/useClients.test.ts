import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useClients } from '../useClients';

// Mock Supabase client
const createMockSupabaseTable = (overrides: any = {}) => ({
  select: vi.fn(() => ({
    order: vi.fn(() => ({
      data: [],
      error: null,
    })),
  })),
  insert: vi.fn(() => ({
    select: vi.fn(() => ({
      single: vi.fn(() => ({
        data: { id: 'client-123', name: 'Test Client' },
        error: null,
      })),
    })),
  })),
  update: vi.fn(() => ({
    eq: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => ({
          data: { id: 'client-123', name: 'Updated Client' },
          error: null,
        })),
      })),
    })),
  })),
  delete: vi.fn(() => ({
    eq: vi.fn(() => ({
      error: null,
    })),
  })),
  ...overrides,
});

const mockSupabase = {
  from: vi.fn(() => createMockSupabaseTable()),
  auth: {
    getUser: vi.fn(() => ({
      data: { user: { id: 'user-123' } },
      error: null,
    })),
  },
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase,
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('useClients', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.from.mockReturnValue(createMockSupabaseTable());
  });

  test('fetches clients on mount', async () => {
    const mockClients = [
      { id: 'client-1', name: 'Client 1', created_at: '2023-01-01' },
      { id: 'client-2', name: 'Client 2', created_at: '2023-01-02' },
    ];

    mockSupabase.from.mockReturnValue(createMockSupabaseTable({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: mockClients,
          error: null,
        })),
      })),
    }));

    const { result } = renderHook(() => useClients());

    // Initially loading should be true
    expect(result.current.loading).toBe(true);

    // Wait for the effect to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.clients).toEqual(mockClients);
    expect(result.current.loading).toBe(false);
    expect(mockSupabase.from).toHaveBeenCalledWith('clients');
  });

  test('adds a new client successfully', async () => {
    const newClient = { name: 'New Client', email: 'test@example.com' };
    const createdClient = { id: 'client-123', ...newClient, user_id: 'user-123' };

    mockSupabase.from.mockReturnValue(createMockSupabaseTable({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: createdClient,
            error: null,
          })),
        })),
      })),
    }));

    const { result } = renderHook(() => useClients());

    await act(async () => {
      const client = await result.current.addClient(newClient);
      expect(client).toEqual(createdClient);
    });

    expect(mockSupabase.from).toHaveBeenCalledWith('clients');
  });

  test('handles client creation error', async () => {
    const newClient = { name: 'New Client' };
    const mockError = new Error('Database error');

    mockSupabase.from.mockReturnValue(createMockSupabaseTable({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: null,
            error: mockError,
          })),
        })),
      })),
    }));

    const { result } = renderHook(() => useClients());

    await act(async () => {
      await expect(result.current.addClient(newClient)).rejects.toThrow('Database error');
    });
  });

  test('updates a client successfully', async () => {
    const clientId = 'client-123';
    const updates = { name: 'Updated Client' };
    const updatedClient = { id: clientId, ...updates };

    mockSupabase.from.mockReturnValue(createMockSupabaseTable({
      select: vi.fn(() => ({
        order: vi.fn(() => ({ data: [{ id: clientId, name: 'Original Client' }], error: null })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: updatedClient,
              error: null,
            })),
          })),
        })),
      })),
    }));

    const { result } = renderHook(() => useClients());

    await act(async () => {
      const client = await result.current.updateClient(clientId, updates);
      expect(client).toEqual(updatedClient);
    });
  });

  test('deletes a client successfully', async () => {
    const clientId = 'client-123';
    const initialClients = [
      { id: clientId, name: 'Client to Delete' },
      { id: 'client-456', name: 'Other Client' },
    ];

    mockSupabase.from.mockReturnValue(createMockSupabaseTable({
      select: vi.fn(() => ({
        order: vi.fn(() => ({ data: initialClients, error: null })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          error: null,
        })),
      })),
    }));

    const { result } = renderHook(() => useClients());

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.deleteClient(clientId);
    });

    expect(result.current.clients).toHaveLength(1);
    expect(result.current.clients[0].id).toBe('client-456');
  });
});