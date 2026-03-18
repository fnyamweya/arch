// Utility
export { cn } from "./lib/utils";

// Types
export type { NavItem, PermissionCheck, BreadcrumbItem } from "./types";

// Icons
export { Icons } from "./components/icons";
export type { Icon } from "./components/icons";

// UI Primitives
export { Button, buttonVariants } from "./components/ui/button";
export type { ButtonProps } from "./components/ui/button";
export { Badge, badgeVariants } from "./components/ui/badge";
export type { BadgeProps } from "./components/ui/badge";
export {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./components/ui/card";
export { Separator } from "./components/ui/separator";
export { Avatar, AvatarImage, AvatarFallback } from "./components/ui/avatar";
export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,
} from "./components/ui/dropdown-menu";
export { ScrollArea, ScrollBar } from "./components/ui/scroll-area";
export {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from "./components/ui/tooltip";
export { Input } from "./components/ui/input";
export { Skeleton } from "./components/ui/skeleton";
export {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem as BreadcrumbUIItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
} from "./components/ui/breadcrumb";
export {
    Sheet,
    SheetPortal,
    SheetOverlay,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
} from "./components/ui/sheet";
export {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from "./components/ui/collapsible";
export { Heading } from "./components/ui/heading";
export {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarSeparator,
    SidebarTrigger,
    useSidebar,
} from "./components/ui/sidebar";

// Layout Components
export { AppSidebar } from "./components/layout/app-sidebar";
export { Breadcrumbs } from "./components/layout/breadcrumbs";
export { DashboardHeader } from "./components/layout/dashboard-header";
export { DashboardShell } from "./components/layout/dashboard-shell";
export {
    DashboardFormPageTemplate,
    DashboardOverviewTemplate,
    DashboardTablePageTemplate,
} from "./components/layout/dashboard-templates";
export type {
    DashboardActivityCard,
    DashboardAreaChartCard,
    DashboardBarChartCard,
    DashboardBarSeries,
    DashboardDonutChartCard,
    DashboardDonutSlice,
    DashboardFormCard,
    DashboardFormField,
    DashboardFormPageTemplateProps,
    DashboardFormSection,
    DashboardInsightCard,
    DashboardMetric,
    DashboardOverviewTemplateProps,
    DashboardStatusItem,
    DashboardTab,
    DashboardTableCard,
    DashboardTablePageTemplateProps,
    DashboardTableRow,
} from "./components/layout/dashboard-templates";
export { StoreShell } from "./components/layout/store-shell";
export { PageContainer } from "./components/layout/page-container";
export { UserAvatarProfile } from "./components/layout/user-avatar-profile";
export { UserNav } from "./components/layout/user-nav";
export { AppProviders } from "./components/layout/app-providers";

// Auth Components
export { AuthProviders } from "./components/auth/auth-providers";
export { SignInView } from "./components/auth/sign-in-view";
export { SignUpView } from "./components/auth/sign-up-view";
export { createAuthMiddleware } from "./components/auth/middleware";

// Hooks
export { useIsMobile } from "./hooks/use-mobile";
export { useBreadcrumbs } from "./hooks/use-breadcrumbs";
