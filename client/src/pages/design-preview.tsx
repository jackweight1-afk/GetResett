import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Cloud, Heart, Zap, Brain, Battery, Sparkles } from 'lucide-react';

export default function DesignPreview() {
  return (
    <div className="min-h-screen" style={{ 
      backgroundColor: '#FCFAF7',
      fontFamily: "'DM Sans', 'Work Sans', sans-serif"
    }}>
      {/* Load Google Fonts */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&family=Work+Sans:wght@400;500;600;700&display=swap');
          
          .preview-heading {
            font-family: 'Plus Jakarta Sans', 'Manrope', sans-serif;
            line-height: 1.6;
          }
          
          .preview-body {
            font-family: 'DM Sans', 'Work Sans', sans-serif;
            line-height: 1.7;
            letter-spacing: 0.01em;
          }
        `}
      </style>

      {/* Header with Deep Espresso */}
      <header style={{ backgroundColor: '#4B3B2F' }} className="py-4 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Button 
              variant="ghost" 
              className="preview-body"
              style={{ color: '#F3F0EB' }}
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Current Design
            </Button>
          </Link>
          <h1 className="preview-heading text-2xl font-semibold" style={{ color: '#F3F0EB' }}>
            GetResett
          </h1>
          <div style={{ width: '140px' }}></div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 sm:p-8">
        {/* Title Section */}
        <div className="mb-12 text-center">
          <h1 className="preview-heading text-5xl font-bold mb-4" style={{ color: '#2A2A2A' }}>
            Neutral Elegance Preview
          </h1>
          <p className="preview-body text-xl mb-2" style={{ color: '#6E665E' }}>
            A calm, grounding design for mindful moments
          </p>
          <p className="preview-body text-sm" style={{ color: '#9B8E7E' }}>
            Scroll down to see the new palette in action
          </p>
        </div>

        {/* Color Palette Showcase */}
        <div 
          className="rounded-3xl p-8 mb-12 shadow-sm" 
          style={{ backgroundColor: '#F3F0EB' }}
        >
          <h2 className="preview-heading text-2xl font-semibold mb-6" style={{ color: '#4B3B2F' }}>
            Color Palette
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div 
                className="h-24 rounded-2xl mb-3 shadow-sm"
                style={{ backgroundColor: '#D9CBB6' }}
              ></div>
              <p className="preview-body font-medium text-sm" style={{ color: '#2A2A2A' }}>Warm Sand</p>
              <p className="preview-body text-xs" style={{ color: '#6E665E' }}>#D9CBB6</p>
            </div>
            <div className="text-center">
              <div 
                className="h-24 rounded-2xl mb-3 shadow-sm border"
                style={{ backgroundColor: '#F3F0EB', borderColor: '#9B8E7E33' }}
              ></div>
              <p className="preview-body font-medium text-sm" style={{ color: '#2A2A2A' }}>Light Stone</p>
              <p className="preview-body text-xs" style={{ color: '#6E665E' }}>#F3F0EB</p>
            </div>
            <div className="text-center">
              <div 
                className="h-24 rounded-2xl mb-3 shadow-sm"
                style={{ backgroundColor: '#4B3B2F' }}
              ></div>
              <p className="preview-body font-medium text-sm" style={{ color: '#2A2A2A' }}>Deep Espresso</p>
              <p className="preview-body text-xs" style={{ color: '#6E665E' }}>#4B3B2F</p>
            </div>
            <div className="text-center">
              <div 
                className="h-24 rounded-2xl mb-3 shadow-sm"
                style={{ backgroundColor: '#9B8E7E' }}
              ></div>
              <p className="preview-body font-medium text-sm" style={{ color: '#2A2A2A' }}>Muted Olive</p>
              <p className="preview-body text-xs" style={{ color: '#6E665E' }}>#9B8E7E</p>
            </div>
          </div>
        </div>

        {/* Typography Showcase */}
        <div 
          className="rounded-3xl p-8 mb-12 shadow-sm" 
          style={{ backgroundColor: '#F3F0EB' }}
        >
          <h2 className="preview-heading text-2xl font-semibold mb-6" style={{ color: '#4B3B2F' }}>
            Typography
          </h2>
          <div className="space-y-6">
            <div>
              <p className="preview-body text-xs mb-2" style={{ color: '#9B8E7E' }}>
                Headings: Plus Jakarta Sans / Manrope
              </p>
              <h1 className="preview-heading text-4xl font-bold mb-2" style={{ color: '#2A2A2A' }}>
                How are you feeling?
              </h1>
              <h2 className="preview-heading text-3xl font-semibold mb-2" style={{ color: '#2A2A2A' }}>
                Choose your reset
              </h2>
              <h3 className="preview-heading text-2xl font-medium" style={{ color: '#4B3B2F' }}>
                Science-backed wellness
              </h3>
            </div>
            <div>
              <p className="preview-body text-xs mb-2" style={{ color: '#9B8E7E' }}>
                Body Text: DM Sans / Work Sans
              </p>
              <p className="preview-body text-lg mb-2" style={{ color: '#2A2A2A' }}>
                GetResett offers science-backed 60-second reset sessions for mental and physical well-being.
              </p>
              <p className="preview-body text-base mb-2" style={{ color: '#6E665E' }}>
                Quick mental and physical resets designed for ADHD and busy minds.
              </p>
              <p className="preview-body text-sm" style={{ color: '#9B8E7E' }}>
                Track your progress and maintain wellness streaks
              </p>
            </div>
          </div>
        </div>

        {/* Buttons Showcase */}
        <div 
          className="rounded-3xl p-8 mb-12 shadow-sm" 
          style={{ backgroundColor: '#F3F0EB' }}
        >
          <h2 className="preview-heading text-2xl font-semibold mb-6" style={{ color: '#4B3B2F' }}>
            Buttons & Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              className="preview-body px-8 py-3 rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
              style={{ 
                backgroundColor: '#D9CBB6',
                color: '#4B3B2F'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9B8E7E'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D9CBB6'}
              data-testid="button-primary"
            >
              Start Your Reset
            </button>
            <button
              className="preview-body px-8 py-3 rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
              style={{ 
                backgroundColor: '#4B3B2F',
                color: '#F3F0EB'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6E665E'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4B3B2F'}
              data-testid="button-secondary"
            >
              Learn More
            </button>
            <button
              className="preview-body px-8 py-3 rounded-xl font-medium transition-all"
              style={{ 
                backgroundColor: 'transparent',
                color: '#6E665E',
                border: '1px solid #9B8E7E'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F3F0EB';
                e.currentTarget.style.color = '#4B3B2F';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#6E665E';
              }}
              data-testid="button-outline"
            >
              Maybe Later
            </button>
          </div>
        </div>

        {/* Emotion Cards Preview */}
        <div className="mb-12">
          <h2 className="preview-heading text-3xl font-semibold mb-6 text-center" style={{ color: '#2A2A2A' }}>
            How are you feeling?
          </h2>
          <p className="preview-body text-center mb-8" style={{ color: '#6E665E' }}>
            Choose what you're experiencing right now
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stressed */}
            <div 
              className="rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
              style={{ backgroundColor: '#F3F0EB' }}
              data-testid="emotion-stressed"
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: '#D9CBB6' }}
              >
                <Cloud className="w-8 h-8" style={{ color: '#4B3B2F' }} />
              </div>
              <h3 className="preview-heading text-xl font-semibold mb-2" style={{ color: '#2A2A2A' }}>
                Stressed
              </h3>
              <p className="preview-body text-sm" style={{ color: '#6E665E' }}>
                Feeling pressure and tension
              </p>
            </div>

            {/* Anxious */}
            <div 
              className="rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
              style={{ backgroundColor: '#F3F0EB' }}
              data-testid="emotion-anxious"
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: '#D9CBB6' }}
              >
                <Heart className="w-8 h-8" style={{ color: '#4B3B2F' }} />
              </div>
              <h3 className="preview-heading text-xl font-semibold mb-2" style={{ color: '#2A2A2A' }}>
                Anxious
              </h3>
              <p className="preview-body text-sm" style={{ color: '#6E665E' }}>
                Worried or uneasy
              </p>
            </div>

            {/* Restless */}
            <div 
              className="rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
              style={{ backgroundColor: '#F3F0EB' }}
              data-testid="emotion-restless"
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: '#9B8E7E' }}
              >
                <Zap className="w-8 h-8" style={{ color: '#FCFAF7' }} />
              </div>
              <h3 className="preview-heading text-xl font-semibold mb-2" style={{ color: '#2A2A2A' }}>
                Restless
              </h3>
              <p className="preview-body text-sm" style={{ color: '#6E665E' }}>
                Unable to stay still
              </p>
            </div>

            {/* Overwhelmed */}
            <div 
              className="rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
              style={{ backgroundColor: '#F3F0EB' }}
              data-testid="emotion-overwhelmed"
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: '#D9CBB6' }}
              >
                <Brain className="w-8 h-8" style={{ color: '#4B3B2F' }} />
              </div>
              <h3 className="preview-heading text-xl font-semibold mb-2" style={{ color: '#2A2A2A' }}>
                Overwhelmed
              </h3>
              <p className="preview-body text-sm" style={{ color: '#6E665E' }}>
                Too much to handle
              </p>
            </div>

            {/* Tired */}
            <div 
              className="rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
              style={{ backgroundColor: '#F3F0EB' }}
              data-testid="emotion-tired"
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: '#9B8E7E' }}
              >
                <Battery className="w-8 h-8" style={{ color: '#FCFAF7' }} />
              </div>
              <h3 className="preview-heading text-xl font-semibold mb-2" style={{ color: '#2A2A2A' }}>
                Tired
              </h3>
              <p className="preview-body text-sm" style={{ color: '#6E665E' }}>
                Low energy and fatigued
              </p>
            </div>

            {/* Scattered */}
            <div 
              className="rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
              style={{ backgroundColor: '#F3F0EB' }}
              data-testid="emotion-scattered"
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: '#9B8E7E' }}
              >
                <Sparkles className="w-8 h-8" style={{ color: '#FCFAF7' }} />
              </div>
              <h3 className="preview-heading text-xl font-semibold mb-2" style={{ color: '#2A2A2A' }}>
                Scattered
              </h3>
              <p className="preview-body text-sm" style={{ color: '#6E665E' }}>
                Unfocused and distracted
              </p>
            </div>
          </div>
        </div>

        {/* Sample Card Layout */}
        <div 
          className="rounded-3xl p-8 shadow-sm"
          style={{ backgroundColor: '#F3F0EB' }}
        >
          <h2 className="preview-heading text-2xl font-semibold mb-4" style={{ color: '#4B3B2F' }}>
            Sample Reset Card
          </h2>
          <p className="preview-body text-base mb-6" style={{ color: '#6E665E' }}>
            This is how reset options will appear with the new design system
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className="rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md"
              style={{ backgroundColor: '#FCFAF7', border: '1px solid #D9CBB6' }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#D9CBB6' }}
                >
                  <Sparkles className="w-6 h-6" style={{ color: '#4B3B2F' }} />
                </div>
                <div className="flex-1">
                  <h3 className="preview-heading font-semibold mb-1" style={{ color: '#2A2A2A' }}>
                    Mountain Meditation
                  </h3>
                  <p className="preview-body text-sm mb-2" style={{ color: '#6E665E' }}>
                    A guided story to ground your thoughts
                  </p>
                  <p className="preview-body text-xs" style={{ color: '#9B8E7E' }}>
                    📖 Story • 90 seconds
                  </p>
                </div>
              </div>
            </div>

            <div 
              className="rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md"
              style={{ backgroundColor: '#FCFAF7', border: '1px solid #D9CBB6' }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#9B8E7E' }}
                >
                  <Heart className="w-6 h-6" style={{ color: '#FCFAF7' }} />
                </div>
                <div className="flex-1">
                  <h3 className="preview-heading font-semibold mb-1" style={{ color: '#2A2A2A' }}>
                    Box Breathing
                  </h3>
                  <p className="preview-body text-sm mb-2" style={{ color: '#6E665E' }}>
                    Calm your nervous system quickly
                  </p>
                  <p className="preview-body text-xs" style={{ color: '#9B8E7E' }}>
                    🎮 Interactive • 60 seconds
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="preview-body text-sm mb-4" style={{ color: '#6E665E' }}>
            This is a preview of the Neutral Elegance design system
          </p>
          <Link href="/">
            <button
              className="preview-body px-6 py-2 rounded-xl font-medium transition-all"
              style={{ 
                backgroundColor: '#4B3B2F',
                color: '#F3F0EB'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6E665E'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4B3B2F'}
              data-testid="button-return"
            >
              Return to Current Design
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
