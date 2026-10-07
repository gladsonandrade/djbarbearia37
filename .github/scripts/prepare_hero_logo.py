from pathlib import Path
import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "web" / "public" / "assets" / "logo-dj-barbearia.jpeg"
DST = ROOT / "web" / "public" / "assets" / "logo-dj-transparent.png"

image = cv2.imread(str(SRC), cv2.IMREAD_COLOR)
if image is None:
    raise SystemExit(f"Não foi possível abrir {SRC}")

height, width = image.shape[:2]

mask = np.zeros((height, width), np.uint8)
background = np.zeros((1, 65), np.float64)
foreground = np.zeros((1, 65), np.float64)

# O emblema ocupa a parte central do arquivo original.
rect = (
    int(width * 0.27),
    int(height * 0.06),
    int(width * 0.50),
    int(height * 0.88),
)

cv2.grabCut(
    image,
    mask,
    rect,
    background,
    foreground,
    8,
    cv2.GC_INIT_WITH_RECT,
)

alpha = np.where(
    (mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD),
    255,
    0,
).astype("uint8")

# Fecha pequenas falhas, mas mantém a borda firme para não criar halo/cinza.
kernel = np.ones((3, 3), np.uint8)
alpha = cv2.morphologyEx(alpha, cv2.MORPH_CLOSE, kernel, iterations=1)
alpha = np.where(alpha > 127, 255, 0).astype("uint8")

ys, xs = np.where(alpha > 8)
if len(xs) == 0 or len(ys) == 0:
    raise SystemExit("Não foi possível detectar o emblema.")

padding = 24
x0 = max(0, int(xs.min()) - padding)
x1 = min(width, int(xs.max()) + 1 + padding)
y0 = max(0, int(ys.min()) - padding)
y1 = min(height, int(ys.max()) + 1 + padding)

b, g, r = cv2.split(image)
rgba = cv2.merge([b, g, r, alpha])[y0:y1, x0:x1]

# Mantém o desenho fiel e dá nitidez leve sem borrar o canal alpha.
rgb = rgba[:, :, :3]
a = rgba[:, :, 3]

scale = 1.45
target = (
    max(1, round(rgba.shape[1] * scale)),
    max(1, round(rgba.shape[0] * scale)),
)
rgb = cv2.resize(rgb, target, interpolation=cv2.INTER_LANCZOS4)
a = cv2.resize(a, target, interpolation=cv2.INTER_NEAREST)

blur = cv2.GaussianBlur(rgb, (0, 0), 0.75)
rgb = cv2.addWeighted(rgb, 1.18, blur, -0.18, 0)

output = np.dstack([rgb, a])
cv2.imwrite(str(DST), output, [cv2.IMWRITE_PNG_COMPRESSION, 9])

print(f"Logo transparente gerado: {DST} ({target[0]}x{target[1]})")
