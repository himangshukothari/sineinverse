'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import styles from './Toast.module.css';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => { } });

export function useToast() {
    return useContext(ToastContext);
}

let toastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const toast = useCallback((message: string, type: ToastType = 'info') => {
        const id = ++toastId;
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3500);
    }, []);

    const dismiss = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className={styles.container}>
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`${styles.toast} ${styles[t.type]}`}
                        onClick={() => dismiss(t.id)}
                    >
                        <span className={styles.icon}>
                            {t.type === 'success' && '✓'}
                            {t.type === 'error' && '✕'}
                            {t.type === 'info' && 'ℹ'}
                        </span>
                        <span className={styles.message}>{t.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
