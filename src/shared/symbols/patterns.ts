/**
 * Common UI patterns and decorative elements used across the application
 * This file centralizes reusable UI patterns for easier maintenance and consistency
 */

export const Patterns = {
  // Gradients
  GRADIENTS: {
    // SVG gradients for backgrounds
    BLUE_PURPLE: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='600' y1='25' x2='600' y2='777'%3E%3Cstop offset='0' stop-color='%230033CC'/%3E%3Cstop offset='1' stop-color='%23AA00FF'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='650' y1='25' x2='650' y2='777'%3E%3Cstop offset='0' stop-color='%230059cc'/%3E%3Cstop offset='1' stop-color='%23d154ff'/%3E%3C/linearGradient%3E%3ClinearGradient id='c' gradientUnits='userSpaceOnUse' x1='700' y1='25' x2='700' y2='777'%3E%3Cstop offset='0' stop-color='%2300a0cc'/%3E%3Cstop offset='1' stop-color='%23d375ff'/%3E%3C/linearGradient%3E%3ClinearGradient id='d' gradientUnits='userSpaceOnUse' x1='750' y1='25' x2='750' y2='777'%3E%3Cstop offset='0' stop-color='%23cce5ff'/%3E%3Cstop offset='1' stop-color='%23e5bfff'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23a)' width='1200' height='800'/%3E%3Cg %3E%3Cpath fill='url(%23b)' d='M1100.5,500.5c-200,0-200-153-400-153s-200,153-400,153s-200-153-400-153s-200,153-400,153s200-153,400-153s200,153,400,153s200-153,400-153S1300.5,500.5,1100.5,500.5z'/%3E%3C/g%3E%3Cg %3E%3Cpath fill='url(%23c)' d='M1100.5,500.5c-200,0-200-76.5-400-76.5s-200,76.5-400,76.5s-200-76.5-400-76.5s-200,76.5-400,76.5s200-76.5,400-76.5s200,76.5,400,76.5s200-76.5,400-76.5S1300.5,500.5,1100.5,500.5z'/%3E%3C/g%3E%3Cg %3E%3Cpath fill='url(%23d)' d='M1100.5,500.5c-200,0-200-38.2-400-38.2s-200,38.2-400,38.2s-200-38.2-400-38.2s-200,38.2-400,38.2s200-38.2,400-38.2s200,38.2,400,38.2s200-38.2,400-38.2S1300.5,500.5,1100.5,500.5z'/%3E%3C/g%3E%3C/svg%3E")`,

    GREEN_BLUE: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='600' y1='25' x2='600' y2='777'%3E%3Cstop offset='0' stop-color='%2300CC33'/%3E%3Cstop offset='1' stop-color='%230099FF'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='650' y1='25' x2='650' y2='777'%3E%3Cstop offset='0' stop-color='%2300cc82'/%3E%3Cstop offset='1' stop-color='%2300b7ff'/%3E%3C/linearGradient%3E%3ClinearGradient id='c' gradientUnits='userSpaceOnUse' x1='700' y1='25' x2='700' y2='777'%3E%3Cstop offset='0' stop-color='%2300cca7'/%3E%3Cstop offset='1' stop-color='%2354baff'/%3E%3C/linearGradient%3E%3ClinearGradient id='d' gradientUnits='userSpaceOnUse' x1='750' y1='25' x2='750' y2='777'%3E%3Cstop offset='0' stop-color='%23ccffd3'/%3E%3Cstop offset='1' stop-color='%23bfe8ff'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23a)' width='1200' height='800'/%3E%3Cg %3E%3Cpath fill='url(%23b)' d='M1100.5,500.5c-200,0-200-153-400-153s-200,153-400,153s-200-153-400-153s-200,153-400,153s200-153,400-153s200,153,400,153s200-153,400-153S1300.5,500.5,1100.5,500.5z'/%3E%3C/g%3E%3Cg %3E%3Cpath fill='url(%23c)' d='M1100.5,500.5c-200,0-200-76.5-400-76.5s-200,76.5-400,76.5s-200-76.5-400-76.5s-200,76.5-400,76.5s200-76.5,400-76.5s200,76.5,400,76.5s200-76.5,400-76.5S1300.5,500.5,1100.5,500.5z'/%3E%3C/g%3E%3Cg %3E%3Cpath fill='url(%23d)' d='M1100.5,500.5c-200,0-200-38.2-400-38.2s-200,38.2-400,38.2s-200-38.2-400-38.2s-200,38.2-400,38.2s200-38.2,400-38.2s200,38.2,400,38.2s200-38.2,400-38.2S1300.5,500.5,1100.5,500.5z'/%3E%3C/g%3E%3C/svg%3E")`,
  },

  // Background patterns
  BACKGROUNDS: {
    DOTS: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,

    ZIGZAG: `url("data:image/svg+xml,%3Csvg width='40' height='12' viewBox='0 0 40 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 6.172L6.172 0h5.656L0 11.828V6.172zm40 5.656L28.172 0h5.656L40 6.172v5.656zM6.172 12l12-12h3.656l12 12h-5.656L20 3.828 11.828 12H6.172zm12 0L20 10.172 21.828 12h-3.656z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,

    GRID: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M0 0h24v24H0V0zm22 22H2V2h20v20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  },

  // Decorative elements
  DECORATIVE: {
    // Star pattern used in backgrounds
    STARS_BG: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpolygon points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,

    // Wave pattern for section dividers
    WAVE_DIVIDER: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' fill='%23ffffff'/%3E%3C/svg%3E")`,
    
    // Curved pattern for section dividers
    CURVE_DIVIDER: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M1200 120L0 16.48 0 0 1200 0 1200 120z' fill='%23ffffff'/%3E%3C/svg%3E")`,
  },

  // Animated patterns (CSS to be used with these backgrounds)
  ANIMATIONS: {
    // Gradient animation
    GRADIENT_SHIFT: `
      background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
      background-size: 400% 400%;
      animation: gradient 15s ease infinite;
      
      @keyframes gradient {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
    `,
    
    // Floating animation for elements
    FLOAT: `
      animation: float 6s ease-in-out infinite;
      
      @keyframes float {
        0% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-20px);
        }
        100% {
          transform: translateY(0px);
        }
      }
    `,
  },
}; 