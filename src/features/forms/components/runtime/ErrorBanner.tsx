import { } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '../../../../components/ui/button';
import { 
  AlertTriangle, 
  RefreshCw, 
  X,
  WifiOff,
  Server,
  Shield
} from 'lucide-react';

export type ErrorType = 
  | 'network'
  | 'server'
  | 'validation'
  | 'permission'
  | 'unknown';

interface ErrorBannerProps {
  error: string;
  type?: ErrorType;
  onRetry?: () => void;
  onDismiss?: () => void;
  retryLabel?: string;
  showRetry?: boolean;
}

const ERROR_CONFIGS = {
  network: {
    icon: WifiOff,
    title: 'Connection Error',
    variant: 'destructive' as const,
    description: 'Please check your internet connection and try again.'
  },
  server: {
    icon: Server,
    title: 'Server Error',
    variant: 'destructive' as const,
    description: 'There was a problem with our servers. Please try again later.'
  },
  validation: {
    icon: AlertTriangle,
    title: 'Validation Error',
    variant: 'destructive' as const,
    description: 'Please check your form data and try again.'
  },
  permission: {
    icon: Shield,
    title: 'Permission Error',
    variant: 'destructive' as const,
    description: 'You do not have permission to perform this action.'
  },
  unknown: {
    icon: AlertTriangle,
    title: 'Error',
    variant: 'destructive' as const,
    description: 'An unexpected error occurred.'
  }
};

export function ErrorBanner({
  error,
  type = 'unknown',
  onRetry,
  onDismiss,
  retryLabel = 'Try Again',
  showRetry = true
}: ErrorBannerProps) {
  const config = ERROR_CONFIGS[type];
  const IconComponent = config.icon;

  return (
    <Alert variant={config.variant} className="relative">
      <IconComponent className="h-4 w-4" />
      <AlertDescription>
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-4">
            <div className="font-medium mb-1">{config.title}</div>
            <div className="text-sm mb-2">{error}</div>
            <div className="text-xs text-muted-foreground">
              {config.description}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {showRetry && onRetry && (
              <Button
                size="sm"
                variant="outline"
                onClick={onRetry}
                className="h-8"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                {retryLabel}
              </Button>
            )}
            
            {onDismiss && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onDismiss}
                className="h-8 w-8 p-0"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Dismiss</span>
              </Button>
            )}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}

// Utility function to determine error type from error message or object
export function getErrorType(error: unknown): ErrorType {
  if (typeof error === 'string') {
    const message = error.toLowerCase();
    
    if (message.includes('network') || message.includes('connection') || message.includes('fetch')) {
      return 'network';
    }
    
    if (message.includes('server') || message.includes('500') || message.includes('502') || message.includes('503')) {
      return 'server';
    }
    
    if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
      return 'validation';
    }
    
    if (message.includes('permission') || message.includes('unauthorized') || message.includes('forbidden')) {
      return 'permission';
    }
  }
  
  if (error instanceof Error) {
    return getErrorType(error.message);
  }
  
  return 'unknown';
}

// Pre-configured error banners for common scenarios
export function NetworkErrorBanner({ onRetry, onDismiss }: { onRetry?: () => void; onDismiss?: () => void }) {
  return (
    <ErrorBanner
      error="Unable to connect to the server"
      type="network"
      onRetry={onRetry}
      onDismiss={onDismiss}
    />
  );
}

export function ServerErrorBanner({ onRetry, onDismiss }: { onRetry?: () => void; onDismiss?: () => void }) {
  return (
    <ErrorBanner
      error="Internal server error occurred"
      type="server"
      onRetry={onRetry}
      onDismiss={onDismiss}
    />
  );
}

export function ValidationErrorBanner({ 
  errors, 
  onDismiss 
}: { 
  errors: string[]; 
  onDismiss?: () => void; 
}) {
  return (
    <ErrorBanner
      error={errors.join(', ')}
      type="validation"
      onDismiss={onDismiss}
      showRetry={false}
    />
  );
}
