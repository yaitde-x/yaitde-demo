
import { extractHostnameOnly, extractQueryParameter } from "../core/fastify-utilities";

test('handles undefined', () => {
    const result = extractHostnameOnly(undefined);
    expect(result).toBeUndefined();
});

test('handles null', () => {
    const result = extractHostnameOnly(null);
    expect(result).toBeNull();
});

test('works when there is no port', () => {
    const result = extractHostnameOnly("linda.getoffmylawn.xyz");
    expect(result).toEqual("linda.getoffmylawn.xyz")
});

test('works when there is a port', () => {
    const result = extractHostnameOnly("linda.getoffmylawn.xyz:3000");
    expect(result).toEqual("linda.getoffmylawn.xyz")
});

test('extracts parameter', () => {
    const result = extractQueryParameter("appId", "http://localhost:3000/?appId=yaitde-app-latest");
    expect(result).toEqual("yaitde-app-latest")
});

test('parameter is missing', () => {
    const result = extractQueryParameter("nothere", "http://localhost:3000/?appId=yaitde-app-latest");
    expect(result).toBeUndefined();
});

test('handles undefined', () => {
    const result = extractQueryParameter("appId", undefined);
    expect(result).toBeUndefined();
});

test('handles null', () => {
    const result = extractQueryParameter("appId", null);
    expect(result).toBeUndefined();
});

test('handles empty string', () => {
    const result = extractQueryParameter("appId", "");
    expect(result).toBeUndefined();
});