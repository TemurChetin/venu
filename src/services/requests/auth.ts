import { instance } from "../api/instance";

export interface CheckPhoneRequest {
  phone: string;
}

export interface CheckPhoneResponse {
  message: string;
  token?: string;
  errors?: Array<{
    code: string;
    message: string;
  }>;
}

export interface VerifyOtpRequest {
  phone: string;
  token: string; // OTP code
  guest_id?: number | null; // guest cart owner — backend merges this cart into the user on login
}

export interface VerifyOtpResponse {
  token: string; // JWT token
  status: boolean;
}

/**
 * Check phone and send OTP code via SMS
 * URL: /api/v1/auth/check-phone?phone=+998507137030
 */
export async function checkPhone(
  phone: string
): Promise<CheckPhoneResponse> {
  const response = await instance.post<CheckPhoneResponse>(
    `/api/v1/auth/check-phone?phone=${encodeURIComponent(phone)}`,
    { phone }
  );
  return response.data;
}

/**
 * Verify OTP code and login/register user
 * Returns JWT token for authentication
 * Based on auth-steps.txt: uses 'phone' and 'token' (OTP code) fields
 */
export async function verifyOtp(
  data: VerifyOtpRequest
): Promise<VerifyOtpResponse> {
  const response = await instance.post<VerifyOtpResponse>(
    "/api/v1/auth/verify-otp",
    {
      phone: data.phone,
      token: data.token, // OTP code (6 digits)
      // Pass guest_id so the backend can merge the guest cart into the user
      ...(data.guest_id ? { guest_id: data.guest_id } : {}),
    }
  );
  return response.data;
}

