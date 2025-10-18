import type { SomeUsableResponseIdk } from "./api";

export class Convert {
    public static toSomeUsableResponses(json: string): SomeUsableResponseIdk[] {
        const usableResponses: SomeUsableResponseIdk[] = JSON.parse(json);
        return usableResponses;
    }
}
