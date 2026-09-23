import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
    const token = localStorage.getItem("pf_token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;

// import { useEffect, useState } from "react";
// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { apiFetch, clearToken, getToken } from "../lib/apiClient";

// export default function ProtectedRoute({
//     allowedRoles = [],
// }) {
//     const location = useLocation();

//     const [loading, setLoading] = useState(true);
//     const [user, setUser] = useState(null);

//     useEffect(() => {
//         let mounted = true;

//         async function checkAuth() {
//             const token = getToken();

//             // Aucun token
//             if (!token) {
//                 if (mounted) {
//                     setLoading(false);
//                 }
//                 return;
//             }

//             try {
//                 // À adapter à ton endpoint backend
//                 const response = await apiFetch("/auth/me");

//                 if (!mounted) return;

//                 setUser(response.user ?? response);
//             } catch (error) {
//                 if (!mounted) return;

//                 clearToken();
//                 setUser(null);
//             } finally {
//                 if (mounted) {
//                     setLoading(false);
//                 }
//             }
//         }

//         checkAuth();

//         return () => {
//             mounted = false;
//         };
//     }, []);

//     // Vérification du token en cours
//     if (loading) {
//         return (
//             <div className="flex min-h-screen items-center justify-center bg-[#FAF9FB]">
//                 <div className="text-center">
//                     <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-pf-purple border-t-transparent" />

//                     <p className="mt-3 text-sm text-gray-500">
//                         Vérification de votre session...
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     // Non connecté
//     if (!user) {
//         return (
//             <Navigate
//                 to="/login"
//                 replace
//                 state={{ from: location }}
//             />
//         );
//     }

//     // Si aucun rôle spécifique n'est demandé
//     if (allowedRoles.length === 0) {
//         return <Outlet />;
//     }

//     // Vérification du rôle
//     if (!allowedRoles.includes(user.role)) {
//         return <Navigate to="/403" replace />;
//     }

//     return <Outlet />;
// }