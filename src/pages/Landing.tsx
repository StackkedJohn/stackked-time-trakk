import { Button } from '@/components/ui/button';
import { Clock, ArrowRight, CheckCircle, Timer, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import dashboardMock from '@/assets/dashboard-mock.png';

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold glass-text">
                  Track time. <span className="gradient-text">Bill clean.</span> Profit more.
                </h1>
                <p className="text-xl lg:text-2xl glass-text-muted max-w-2xl">
                  Capture every billable minute without the drama. Built for freelancers who value their time.
                </p>
              </div>
              
              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary/20 hover:bg-primary/30 border-primary/50 glass-text glass-glow text-lg px-8 py-6"
                >
                  <Link to="/auth">
                    Start Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="glass-hover glass-text hover:glass-text text-lg px-8 py-6"
                >
                  <Link to="/pricing">
                    Peek Pricing
                  </Link>
                </Button>
              </div>
              
              {/* Trust indicators */}
              <div className="flex items-center space-x-6 text-sm glass-text-muted">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Free forever plan</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
            
            {/* Product Mock */}
            <div className="relative">
              <div className="glass-lg rounded-2xl p-4 shadow-2xl">
                <img
                  src={dashboardMock}
                  alt="Stackked Time Trakk dashboard interface showing running timer, project list, and weekly hours report"
                  className="w-full h-auto rounded-xl"
                  loading="lazy"
                  width="1024"
                  height="576"
                />
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 glass rounded-xl p-4 animate-pulse">
                <div className="flex items-center space-x-2">
                  <Timer className="w-5 h-5 text-green-400" />
                  <div className="text-right">
                    <div className="glass-text font-bold">2:34:12</div>
                    <div className="glass-text-muted text-xs">Running</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 glass rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-accent" />
                  <div>
                    <div className="glass-text font-bold">40.5h</div>
                    <div className="glass-text-muted text-xs">This week</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold glass-text mb-4">
            Why freelancers choose Stackked
          </h2>
          <p className="text-xl glass-text-muted max-w-3xl mx-auto">
            Simple time tracking that actually helps you get paid faster
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="glass rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold glass-text mb-4">One-click tracking</h3>
            <p className="glass-text-muted">
              Start and stop timers instantly. Manual entries for when you forget to click.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="glass rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold glass-text mb-4">Clean reports</h3>
            <p className="glass-text-muted">
              Weekly and monthly breakdowns that make invoicing a breeze.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="glass rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold glass-text mb-4">Zero hassle</h3>
            <p className="glass-text-muted">
              No complex project setups. Just track, report, and get back to work.
            </p>
          </div>
        </div>
      </div>
      
      {/* Final CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="glass-lg rounded-3xl p-12">
          <h2 className="text-3xl lg:text-4xl font-bold glass-text mb-6">
            Ready to stackk your hours?
          </h2>
          <p className="text-xl glass-text-muted mb-8 max-w-2xl mx-auto">
            Join thousands of freelancers who've taken control of their time and billing.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-primary/20 hover:bg-primary/30 border-primary/50 glass-text glass-glow text-lg px-12 py-6"
          >
            <Link to="/auth">
              Start Free Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;