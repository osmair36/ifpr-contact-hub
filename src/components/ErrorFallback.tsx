import { FallbackProps } from 'react-error-boundary';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center space-y-4 bg-destructive/10 rounded-lg border border-destructive/20 mt-4">
            <AlertCircle className="w-12 h-12 text-destructive" />
            <h2 className="text-xl font-semibold text-destructive">Algo deu errado!</h2>
            <p className="text-sm text-muted-foreground max-w-md">
                Ocorreu um erro ao tentar processar esta ação.
            </p>
            {process.env.NODE_ENV === 'development' && (
                <pre className="text-xs bg-black/10 p-4 rounded text-left overflow-auto max-w-full">
                    {error.message}
                </pre>
            )}
            <Button onClick={resetErrorBoundary} variant="outline" className="mt-4">
                Tentar novamente
            </Button>
        </div>
    );
};
