export default function compile(code: string): {
    diagnosticMessages: string[];
    result: Record<string, string>;
};
