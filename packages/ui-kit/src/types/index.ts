import type { Icons } from "../components/icons";

export interface PermissionCheck {
    readonly permission?: string;
    readonly plan?: string;
    readonly feature?: string;
    readonly role?: string;
    readonly requireOrg?: boolean;
}

export interface NavItem {
    readonly title: string;
    readonly url: string;
    readonly disabled?: boolean;
    readonly external?: boolean;
    readonly shortcut?: readonly [string, string];
    readonly icon?: keyof typeof Icons;
    readonly label?: string;
    readonly description?: string;
    readonly isActive?: boolean;
    readonly items?: readonly NavItem[];
    readonly access?: PermissionCheck;
}

export interface BreadcrumbItem {
    readonly title: string;
    readonly link: string;
}
