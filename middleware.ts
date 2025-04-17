// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// // Tentukan route yang public
// const isPublicRoute = createRouteMatcher([
//   "/api(.*)", // public route pattern
// ]);

// export default clerkMiddleware(async (auth, req) => {
//   // Jika route adalah public, lewati autentikasi
//   if (!isPublicRoute(req)) {
//     await auth.protect()
//   }

//   // Selain itu, Clerk akan menjalankan autentikasi seperti biasa
// });

// export const config = {
//   matcher: [
//     // Jalankan middleware di semua route kecuali _next, static files, dll
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Jalankan juga untuk semua API
//     '/(api|trpc)(.*)',
//   ],
// };


import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Sekarang include semua route public: API, TRPC, sign-in, sign-up, dsb.
const isPublicRoute = createRouteMatcher([
  "/api(.*)",
  "/trpc(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  // jika homepage ingin publik, tambahkan "/"
]);

export default clerkMiddleware(async (auth, req) => {
  // Hanya protect jika bukan public
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // jalankan di semua non‑_next dan file statis
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

