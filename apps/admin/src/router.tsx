import {
  createRootRoute,
  createRoute,
  redirect,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AppLayout } from "@/components/app-layout";
import { AuthLayout } from "@/components/auth-layout";
import { authClient } from "@/lib/auth-client";
import { ChangeEmailPage } from "@/pages/change-email";
import { ChangePasswordPage } from "@/pages/change-password";
import { OtpPage } from "@/pages/otp";
import { ForgotPasswordPage } from "@/pages/forgot-password";
import { ResetPasswordPage } from "@/pages/reset-password";
import { SignInPage } from "@/pages/sign-in";
import { SignUpPage } from "@/pages/sign-up";
import { VerifyEmailPage } from "@/pages/verify-email";
import { DashboardPage } from "@/pages/dashboard";
import { DataTablePage } from "@/pages/data-table";
import { TodosPage } from "@/pages/todos";
import FormTest from "./pages/form-test";
import { CreateColorPage } from "./pages/color-create";
import { EditColorPage } from "./pages/color-edit";

// ---------------------------------------------------------------------------
// Root — no layout, just outlets
// ---------------------------------------------------------------------------
const RootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      {import.meta.env?.DEV && <TanStackRouterDevtools />}
    </>
  ),
});

// ---------------------------------------------------------------------------
// Auth layout group (no sidebar)
// ---------------------------------------------------------------------------
const AuthLayoutRoute = createRoute({
  getParentRoute: () => RootRoute,
  id: "auth-layout",
  component: AuthLayout,
});

const SignInRoute = createRoute({
  getParentRoute: () => AuthLayoutRoute,
  path: "/auth/sign-in",
  component: SignInPage,
});

const SignUpRoute = createRoute({
  getParentRoute: () => AuthLayoutRoute,
  path: "/auth/sign-up",
  component: SignUpPage,
});

const FormTestRoute = createRoute({
  getParentRoute: () => DashboardLayoutRoute,
  path: "/form-test",
  beforeLoad: requireAuth,
  component: FormTest,
});

const ForgotPasswordRoute = createRoute({
  getParentRoute: () => AuthLayoutRoute,
  path: "/auth/forgot-password",
  component: ForgotPasswordPage,
});

const ResetPasswordRoute = createRoute({
  getParentRoute: () => AuthLayoutRoute,
  path: "/auth/reset-password",
  component: ResetPasswordPage,
});

const VerifyEmailRoute = createRoute({
  getParentRoute: () => AuthLayoutRoute,
  path: "/auth/verify-email",
  component: VerifyEmailPage,
});

const OtpRoute = createRoute({
  getParentRoute: () => AuthLayoutRoute,
  path: "/auth/otp",
  component: OtpPage,
});

// ---------------------------------------------------------------------------
// Dashboard layout group (with sidebar, requires auth)
// ---------------------------------------------------------------------------
async function requireAuth() {
  const { data: session } = await authClient.getSession();
  if (!session) {
    throw redirect({
      to: "/auth/sign-in",
      search: { callbackUrl: window.location.pathname },
    });
  }
}

const DashboardLayoutRoute = createRoute({
  getParentRoute: () => RootRoute,
  id: "dashboard-layout",
  component: AppLayout,
});

const IndexRoute = createRoute({
  getParentRoute: () => DashboardLayoutRoute,
  path: "/",
  beforeLoad: requireAuth,
  component: DashboardPage,
});

const TodosRoute = createRoute({
  getParentRoute: () => DashboardLayoutRoute,
  path: "/todos",
  beforeLoad: requireAuth,
  component: TodosPage,
});

const ChangePasswordRoute = createRoute({
  getParentRoute: () => DashboardLayoutRoute,
  path: "/change-password",
  beforeLoad: requireAuth,
  component: ChangePasswordPage,
});

const ChangeEmailRoute = createRoute({
  getParentRoute: () => DashboardLayoutRoute,
  path: "/change-email",
  beforeLoad: requireAuth,
  component: ChangeEmailPage,
});

const DataTableRoute = createRoute({
  getParentRoute: () => DashboardLayoutRoute,
  path: "/data-table",
  beforeLoad: requireAuth,
  component: DataTablePage,
});

const CreateColorRoute = createRoute({
  getParentRoute: () => DashboardLayoutRoute,
  path: "/colors/create",
  beforeLoad: requireAuth,
  component: CreateColorPage,
});

const EditColorRoute = createRoute({
  getParentRoute: () => DashboardLayoutRoute,
  path: "/colors/$colorId/edit",
  beforeLoad: requireAuth,
  component: EditColorPage,
});

export const routeTree = RootRoute.addChildren([
  AuthLayoutRoute.addChildren([
    SignInRoute,
    SignUpRoute,
    ForgotPasswordRoute,
    ResetPasswordRoute,
    VerifyEmailRoute,
    OtpRoute,
  ]),
  DashboardLayoutRoute.addChildren([
    IndexRoute,
    TodosRoute,
    ChangePasswordRoute,
    ChangeEmailRoute,
    DataTableRoute,
    FormTestRoute,
    CreateColorRoute,
    EditColorRoute,
  ]),
]);
