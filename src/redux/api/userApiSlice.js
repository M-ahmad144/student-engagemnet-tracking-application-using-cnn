import { apiSlice } from "./apiSlice";
import { USER_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mutation for login
    login: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),

    // Mutation for logout
    logout: builder.mutation({
      query: () => ({
        url: `${USER_URL}/logout`,
        method: "POST",
      }),
    }),

    // Mutation for register
    register: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),

    // Mutation for profile
    profile: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/profile`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

// Export the hooks generated by the mutations
export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useProfileMutation,
} = userApiSlice;
