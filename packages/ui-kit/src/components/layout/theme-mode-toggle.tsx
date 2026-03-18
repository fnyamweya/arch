"use client";

import * as React from "react";
import { IconBrightness } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

type DocumentWithViewTransition = Document & {
    startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

export function ThemeModeToggle() {
    const { resolvedTheme, setTheme } = useTheme();

    const handleToggle = React.useCallback(
        (event?: React.MouseEvent) => {
            const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
            const root = document.documentElement;
            const documentWithTransition = document as DocumentWithViewTransition;

            if (event) {
                root.style.setProperty("--x", `${event.clientX}px`);
                root.style.setProperty("--y", `${event.clientY}px`);
            }

            if (!documentWithTransition.startViewTransition) {
                setTheme(nextTheme);
                return;
            }

            documentWithTransition.startViewTransition(() => {
                setTheme(nextTheme);
            });
        },
        [resolvedTheme, setTheme]
    );

    return (
        <Button
            type="button"
            variant="secondary"
            size="icon"
            className="group/toggle size-8"
            onClick={handleToggle}
        >
            <IconBrightness className="size-4" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
