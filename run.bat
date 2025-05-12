@echo off
echo ======================================
echo       XLab_Web - Khoi chay du an
echo ======================================
echo.

REM Kiem tra xem node_modules co ton tai khong
if not exist "node_modules\" (
    echo Cai dat cac goi npm...
    npm install
    if %ERRORLEVEL% neq 0 (
        echo Loi: Khong the cai dat cac goi npm. Kiem tra ket noi mang hoac package.json.
        pause
        exit /b 1
    )
    echo Cai dat hoan tat!
) else (
    echo Node modules da duoc cai dat.
)

REM Tao cac thu muc can thiet neu chua ton tai
if not exist ".next\cache\webpack\client-development\" mkdir ".next\cache\webpack\client-development"
if not exist ".next\cache\webpack\server-development\" mkdir ".next\cache\webpack\server-development"
if not exist ".next\static\chunks\" mkdir ".next\static\chunks"
if not exist ".next\static\css\" mkdir ".next\static\css"
if not exist ".next\server\app\" mkdir ".next\server\app"
if not exist ".next\server\chunks\" mkdir ".next\server\chunks"

REM Kiem tra va tao thu muc public/images/placeholder neu chua ton tai
if not exist "public\images\placeholder\" mkdir "public\images\placeholder"

REM Kiem tra file placeholder can thiet
if not exist "public\images\placeholder\product-placeholder.jpg" (
    echo Sao chep file placeholder...
    copy "public\images\placeholder-product.jpg" "public\images\placeholder\product-placeholder.jpg"
    if %ERRORLEVEL% neq 0 (
        echo Canh bao: Khong the sao chep file placeholder.
    ) else (
        echo Sao chep file placeholder thanh cong!
    )
)

REM Sua cac loi export trong file components/common/index.ts
echo Sua loi export trong component files...

REM Kiem tra va tao thu muc common neu chua ton tai
if not exist "src\components\common\" mkdir "src\components\common"

REM Kiem tra va tao file Container neu chua ton tai
if not exist "src\components\common\Container.tsx" (
    echo import React from 'react' > src\components\common\Container.tsx
    echo import { cn } from '@/lib/utils' >> src\components\common\Container.tsx
    echo. >> src\components\common\Container.tsx
    echo interface ContainerProps { >> src\components\common\Container.tsx
    echo   children: React.ReactNode >> src\components\common\Container.tsx
    echo   className?: string >> src\components\common\Container.tsx
    echo } >> src\components\common\Container.tsx
    echo. >> src\components\common\Container.tsx
    echo export const Container: React.FC^<ContainerProps^> = ({ >> src\components\common\Container.tsx
    echo   children, >> src\components\common\Container.tsx
    echo   className = '' >> src\components\common\Container.tsx
    echo }) =^> { >> src\components\common\Container.tsx
    echo   return ( >> src\components\common\Container.tsx
    echo     ^<div className={cn('container mx-auto px-4 md:px-6 max-w-7xl', className)}^> >> src\components\common\Container.tsx
    echo       {children} >> src\components\common\Container.tsx
    echo     ^</div^> >> src\components\common\Container.tsx
    echo   ) >> src\components\common\Container.tsx
    echo } >> src\components\common\Container.tsx
    echo. >> src\components\common\Container.tsx
    echo export default Container >> src\components\common\Container.tsx
    echo Container.tsx created successfully.
)

REM Tao file index.ts moi trong common
echo // Re-export common components > src\components\common\index.ts
echo export { Button, buttonVariants } from './button'; >> src\components\common\index.ts
echo export { default as Spinner } from './Spinner'; >> src\components\common\index.ts
echo export { default as LoadingScreen } from './LoadingScreen'; >> src\components\common\index.ts
echo export { default as CompileIndicator } from './CompileIndicator'; >> src\components\common\index.ts
echo export { default as Container } from './Container'; >> src\components\common\index.ts
echo export { default as Analytics } from './Analytics'; >> src\components\common\index.ts

REM Sua file accounts/page.tsx neu can
if exist "src\app\accounts\page.tsx" (
    echo 'use client' > src\app\accounts\page.tsx
    echo. >> src\app\accounts\page.tsx
    echo import Link from 'next/link' >> src\app\accounts\page.tsx
    echo import { Container } from '@/components/common/Container' >> src\app\accounts\page.tsx
    echo. >> src\app\accounts\page.tsx
    echo export default function AccountsPage() { >> src\app\accounts\page.tsx
    echo   return ( >> src\app\accounts\page.tsx
    echo     ^<Container^> >> src\app\accounts\page.tsx
    echo       ^<div className="flex flex-col items-center justify-center min-h-[50vh] py-20 px-4 text-center"^> >> src\app\accounts\page.tsx
    echo         ^<h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"^>Trang đang được bảo trì^</h1^> >> src\app\accounts\page.tsx
    echo         ^<p className="text-lg text-gray-600 max-w-2xl mb-8"^> >> src\app\accounts\page.tsx
    echo           Chức năng tài khoản đang được nâng cấp và bảo trì. Chúng tôi sẽ sớm quay trở lại với trải nghiệm tốt hơn. >> src\app\accounts\page.tsx
    echo         ^</p^> >> src\app\accounts\page.tsx
    echo         ^<p className="text-gray-500 mb-8"^> >> src\app\accounts\page.tsx
    echo           Vui lòng quay lại sau hoặc liên hệ với chúng tôi nếu bạn cần hỗ trợ. >> src\app\accounts\page.tsx
    echo         ^</p^> >> src\app\accounts\page.tsx
    echo         ^<Link >> src\app\accounts\page.tsx
    echo           href="/" >> src\app\accounts\page.tsx
    echo           className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300" >> src\app\accounts\page.tsx
    echo         ^> >> src\app\accounts\page.tsx
    echo           Quay lại trang chủ >> src\app\accounts\page.tsx
    echo         ^</Link^> >> src\app\accounts\page.tsx
    echo       ^</div^> >> src\app\accounts\page.tsx
    echo     ^</Container^> >> src\app\accounts\page.tsx
    echo   ) >> src\app\accounts\page.tsx
    echo } >> src\app\accounts\page.tsx
    echo Fixed accounts/page.tsx
)

echo.
echo ======================================
echo         Dang khoi chay du an...
echo ======================================
echo.
echo Ctrl+C de huy qua trinh chay

REM Khoi chay du an
npm run dev

pause 