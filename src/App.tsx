import { useEffect } from "react"
import { createBrowserRouter, Outlet, RouterProvider, useLocation } from "react-router"
import { TooltipProvider } from "@/components/ui/tooltip"
import AppShell from "@/components/app-shell"
import Ask from "@/pages/ask"
import Blueprint from "@/pages/blueprint"
import Business from "@/pages/business"
import Haunting from "@/pages/haunting"
import Landing from "@/pages/landing"
import NotFound from "@/pages/not-found"
import Overview from "@/pages/overview"
import Profile from "@/pages/profile"
import States from "@/pages/states"
import Summon from "@/pages/summon"
import Timeline from "@/pages/timeline"

function Root() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return (
    <>
      <a
        href="#main"
        className="fixed top-2 left-2 z-[100] -translate-y-[150%] rounded-md bg-hueso px-3 py-2 text-sm font-semibold text-noche focus:translate-y-0"
      >
        Skip to content
      </a>
      <Outlet />
    </>
  )
}

function RouteError() {
  return (
    <div className="grid min-h-svh place-items-center bg-noche-deep p-6 text-center">
      <div>
        <h1 className="font-display text-3xl font-bold">The ghost slipped away.</h1>
        <p className="mt-2 text-soft">Something went wrong while loading this page.</p>
        <a href="/" className="mt-5 inline-block rounded-lg bg-rosa px-4 py-2.5 font-semibold">
          Back to the start
        </a>
      </div>
    </div>
  )
}

const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: <RouteError />,
    children: [
      { path: "/", element: <Landing /> },
      { path: "/summon", element: <Summon /> },
      { path: "/haunting/:owner/:repo", element: <Haunting /> },
      {
        path: "/r/:owner/:repo",
        element: <AppShell />,
        children: [
          { index: true, element: <Overview /> },
          { path: "profile", element: <Profile /> },
          { path: "timeline", element: <Timeline /> },
          { path: "business", element: <Business /> },
          { path: "blueprint", element: <Blueprint /> },
          { path: "ask", element: <Ask /> },
        ],
      },
      { path: "/states/:state?", element: <States /> },
      { path: "*", element: <NotFound /> },
    ],
  },
])

export default function App() {
  return (
    <TooltipProvider>
      <RouterProvider router={router} />
    </TooltipProvider>
  )
}
