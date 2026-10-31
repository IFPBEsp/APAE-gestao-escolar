import { assetPath } from '@utils/constants';

describe('assetPath', () => {
    it('prefixa o caminho com o basePath da aplicação, com ou sem barra inicial', () => {
        expect(assetPath('/apae-logo.png')).toBe('/gestao-escolar/apae-logo.png');
        expect(assetPath('apae-logo.png')).toBe('/gestao-escolar/apae-logo.png');
    });
});
