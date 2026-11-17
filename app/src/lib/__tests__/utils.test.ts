import { cn } from '@/lib/utils';

describe('cn', () => {
    it('combina classes e resolve conflitos do Tailwind mantendo a última', () => {
        expect(cn('px-2 py-1', false && 'hidden', 'px-4')).toBe('py-1 px-4');
    });
});
