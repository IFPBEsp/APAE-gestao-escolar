import { render, screen } from '@testing-library/react';

import { Button } from '@components/Button/Button';

describe('Button', () => {
    it('renderiza um botão com o texto informado', () => {
        render(<Button>Salvar</Button>);

        expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
    });
});
