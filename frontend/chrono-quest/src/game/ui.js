// Estilos e componentes de interface compartilhados pelas cenas.

export const COLORS = {
    ink: 0x080d1a,
    panel: 0x17243a,
    panelHi: 0x263c5c,
    gold: 0xd8b76a
};

export const INPUT_STYLE =
    'padding:14px;border:1px solid #d8b76a;border-radius:6px;background:#17243a;' +
    'color:#fff;font-size:16px;width:100%;box-sizing:border-box;';

export const PRIMARY_BTN_STYLE =
    'padding:14px;background:#d8b76a;color:#080d1a;border:none;border-radius:6px;' +
    'font-weight:bold;font-size:16px;cursor:pointer;';

export const GHOST_BTN_STYLE =
    'padding:12px;background:transparent;color:#fff;border:1px solid #d8b76a;' +
    'border-radius:6px;font-size:14px;cursor:pointer;';

export function addButton(scene, x, y, w, h, label, onClick, opts = {}) {
    const fill = opts.fill ?? COLORS.panel;

    const bg = scene.add.rectangle(x, y, w, h, fill).setStrokeStyle(1, COLORS.gold);
    const txt = scene.add.text(x, y, label, {
        fontSize: opts.fontSize ?? '16px',
        color: opts.color ?? '#ffffff',
        fontStyle: 'bold',
        align: 'center',
        wordWrap: { width: w - 12 }
    }).setOrigin(0.5);

    let enabled = true;

    bg.setInteractive({ useHandCursor: true });
    bg.on('pointerover', () => enabled && bg.setFillStyle(COLORS.panelHi));
    bg.on('pointerout', () => bg.setFillStyle(fill));
    bg.on('pointerdown', () => enabled && onClick());

    if (opts.container) opts.container.add([bg, txt]);

    return {
        bg,
        txt,
        setEnabled(value) {
            enabled = value;
            bg.setAlpha(value ? 1 : 0.45);
            txt.setAlpha(value ? 1 : 0.45);
        },
        setLabel(text) {
            txt.setText(text);
        },
        destroy() {
            bg.destroy();
            txt.destroy();
        }
    };
}
