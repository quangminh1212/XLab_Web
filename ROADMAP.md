# Modernize & Stabilize Roadmap

## PR 1 (đang thực hiện)
- Engines: Node ">=20 <23" + thêm .nvmrc/.node-version = 22
- Dọn scripts Next: dùng `next build`/`next start`
- Tailwind cleanup: bỏ `mode: 'jit'` và `future.*`
- CI: mở rộng triggers, thêm concurrency, matrix Node 20.x/22.x; tách job lint/typecheck/test/build; upload artifact build/coverage
- Test ổn định: jest.setup.ts để bật jest-dom và chặn noise console
- Script `check` chạy lint + type-check + test; thêm `audit`

## PR 2 (đề xuất)
- Jest đồng bộ phiên bản (giữ Jest 29 để ổn định nhanh) hoặc nâng lên 30 đồng bộ toàn bộ
- Bổ sung @testing-library/react hooks configs nếu cần; mock next/router nếu có test liên quan

## PR 3 (đề xuất)
- package.json: chuyển "resolutions" → "overrides" (npm)
- Khóa major core: next, react, eslint, typescript
- Thêm job `npm audit` vào CI (fail on high/critical)

## PR 4 (đề xuất)
- Env validation bằng zod + @t3-oss/env-nextjs (hoặc custom)
- Cập nhật .env.example

## PR 5 (đề xuất)
- ESLint Flat Config (eslint.config.js) thay .eslintrc.json cho ESLint 9+
- Plugins: import/order hoặc simple-import-sort; jsx-a11y
- Prettier 3 + prettier-plugin-tailwindcss xác nhận hoạt động

## PR 6 (đề xuất)
- next.config.js: bật tối ưu ảnh nếu hạ tầng hỗ trợ; siết remotePatterns; CSP chuẩn (loại X-XSS-Protection)

## PR 7 (đề xuất)
- Husky + lint-staged + commitlint (Conventional Commits)
- Dependabot/Renovate
- E2E (Playwright/Cypress) + coverage report trong CI

