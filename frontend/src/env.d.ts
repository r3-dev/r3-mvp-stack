/// <reference types="astro/client" />

// type for astro.locals
declare namespace App {
    import type PocketBase from 'pocketbase';

    interface Locals {
        pb: PocketBase,
    }
}