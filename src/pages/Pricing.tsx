import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold glass-text gradient-text mb-4">
            Simple pricing that scales
          </h1>
          <p className="text-xl glass-text-muted max-w-3xl mx-auto">
            Start free, upgrade when you're ready. No hidden fees, no surprises.
          </p>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Free Plan */}
          <div className="glass rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold glass-text mb-2">Starter</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold glass-text">Free</span>
                <span className="glass-text-muted ml-2">forever</span>
              </div>
              <p className="glass-text-muted">Perfect for trying things out</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="glass-text">Unlimited time tracking</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="glass-text">Basic reports</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="glass-text">Manual entries</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="glass-text">Calendar view</span>
              </li>
            </ul>
            
            <Button
              asChild
              variant="ghost"
              className="w-full glass-hover glass-text hover:glass-text"
            >
              <Link to="/auth">
                Get Started Free
              </Link>
            </Button>
          </div>
          
          {/* Pro Plan */}
          <div className="glass-lg rounded-2xl p-8 relative border-primary/50">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary/20 glass-text px-4 py-2 rounded-full text-sm font-semibold border border-primary/50">
                Most Popular
              </span>
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold glass-text mb-2">Professional</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold glass-text">$9</span>
                <span className="glass-text-muted ml-2">/month</span>
              </div>
              <p className="glass-text-muted">For serious freelancers</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="glass-text">Everything in Starter</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="glass-text">Advanced reporting</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="glass-text">Invoice templates</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="glass-text">Project organization</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="glass-text">Export data</span>
              </li>
            </ul>
            
            <Button
              asChild
              className="w-full bg-primary/20 hover:bg-primary/30 border-primary/50 glass-text glass-glow"
            >
              <Link to="/auth">
                Start Pro Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          
          {/* Agency Plan */}
          <div className="glass rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold glass-text mb-2">Agency</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold glass-text">$29</span>
                <span className="glass-text-muted ml-2">/month</span>
              </div>
              <p className="glass-text-muted">For teams and agencies</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="glass-text">Everything in Professional</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="glass-text">Team collaboration</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="glass-text">Client portals</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="glass-text">White-label reports</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="glass-text">Priority support</span>
              </li>
            </ul>
            
            <Button
              asChild
              variant="ghost"
              className="w-full glass-hover glass-text hover:glass-text"
            >
              <Link to="/auth">
                Contact Sales
              </Link>
            </Button>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold glass-text mb-8">Frequently asked questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold glass-text mb-3">Can I change plans anytime?</h3>
              <p className="glass-text-muted">
                Absolutely! Upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold glass-text mb-3">Is there a free trial?</h3>
              <p className="glass-text-muted">
                The Starter plan is free forever. Pro and Agency plans include a 14-day free trial.
              </p>
            </div>
            
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold glass-text mb-3">What payment methods do you accept?</h3>
              <p className="glass-text-muted">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </div>
            
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold glass-text mb-3">Can I export my data?</h3>
              <p className="glass-text-muted">
                Yes! All plans include basic data export. Pro and Agency plans offer advanced export options.
              </p>
            </div>
          </div>
        </div>
        
        {/* Final CTA */}
        <div className="text-center mt-16">
          <div className="glass-lg rounded-2xl p-8">
            <h2 className="text-2xl font-bold glass-text mb-4">
              Still have questions?
            </h2>
            <p className="glass-text-muted mb-6">
              We're here to help. Get in touch with our team.
            </p>
            <Button
              asChild
              variant="ghost"
              className="glass-hover glass-text hover:glass-text"
            >
              <Link to="/auth">
                Contact Support
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;