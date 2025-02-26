export type EventType = 'marker' | 'release' | 'maintenance' | 'down';
export interface CreateReleaseRequest {
    apiKey: string;
    name: string;
    type: EventType;
    description?: string;
    environment?: string;
    service?: string;
    compareAfterMinutes?: number;
}
interface Release {
    id: number;
    name: string;
    environment: string;
    service: string;
}
export interface CreateReleaseResponse {
    id: number;
    name: string;
    environment: string;
    service: string;
    releases: Release[];
}
export declare function createRelease(payload: CreateReleaseRequest): Promise<CreateReleaseResponse>;
export {};
