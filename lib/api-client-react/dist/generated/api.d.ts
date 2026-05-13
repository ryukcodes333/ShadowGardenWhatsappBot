import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { AnimeEntry, AuthResponse, CardsPage, ChatMessage, GetChatMessagesParams, GetLeaderboardParams, GetProfileParams, GetTrendingAnimeParams, HealthStatus, LeaderboardEntry, ListCardsParams, LoginInput, MessageInput, MessageResponse, PokemonEntry, Profile, ProfileUpdate, RegisterInput, SiteStats, User } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Register with WhatsApp number or username
 */
export declare const getRegisterUrl: () => string;
export declare const register: (registerInput: RegisterInput, options?: RequestInit) => Promise<AuthResponse>;
export declare const getRegisterMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
        data: BodyType<RegisterInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
    data: BodyType<RegisterInput>;
}, TContext>;
export type RegisterMutationResult = NonNullable<Awaited<ReturnType<typeof register>>>;
export type RegisterMutationBody = BodyType<RegisterInput>;
export type RegisterMutationError = ErrorType<void>;
/**
 * @summary Register with WhatsApp number or username
 */
export declare const useRegister: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
        data: BodyType<RegisterInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof register>>, TError, {
    data: BodyType<RegisterInput>;
}, TContext>;
/**
 * @summary Login with WhatsApp number or username
 */
export declare const getLoginUrl: () => string;
export declare const login: (loginInput: LoginInput, options?: RequestInit) => Promise<AuthResponse>;
export declare const getLoginMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginInput>;
}, TContext>;
export type LoginMutationResult = NonNullable<Awaited<ReturnType<typeof login>>>;
export type LoginMutationBody = BodyType<LoginInput>;
export type LoginMutationError = ErrorType<void>;
/**
 * @summary Login with WhatsApp number or username
 */
export declare const useLogin: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginInput>;
}, TContext>;
/**
 * @summary Logout
 */
export declare const getLogoutUrl: () => string;
export declare const logout: (options?: RequestInit) => Promise<MessageResponse>;
export declare const getLogoutMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
export type LogoutMutationResult = NonNullable<Awaited<ReturnType<typeof logout>>>;
export type LogoutMutationError = ErrorType<unknown>;
/**
 * @summary Logout
 */
export declare const useLogout: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
/**
 * @summary Get current authenticated user
 */
export declare const getGetMeUrl: () => string;
export declare const getMe: (options?: RequestInit) => Promise<User>;
export declare const getGetMeQueryKey: () => readonly ["/api/auth/me"];
export declare const getGetMeQueryOptions: <TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMeQueryResult = NonNullable<Awaited<ReturnType<typeof getMe>>>;
export type GetMeQueryError = ErrorType<void>;
/**
 * @summary Get current authenticated user
 */
export declare function useGetMe<TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get user profile by userId query param (or own profile if omitted)
 */
export declare const getGetProfileUrl: (params?: GetProfileParams) => string;
export declare const getProfile: (params?: GetProfileParams, options?: RequestInit) => Promise<Profile>;
export declare const getGetProfileQueryKey: (params?: GetProfileParams) => readonly ["/api/profile", ...GetProfileParams[]];
export declare const getGetProfileQueryOptions: <TData = Awaited<ReturnType<typeof getProfile>>, TError = ErrorType<void>>(params?: GetProfileParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProfile>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getProfile>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetProfileQueryResult = NonNullable<Awaited<ReturnType<typeof getProfile>>>;
export type GetProfileQueryError = ErrorType<void>;
/**
 * @summary Get user profile by userId query param (or own profile if omitted)
 */
export declare function useGetProfile<TData = Awaited<ReturnType<typeof getProfile>>, TError = ErrorType<void>>(params?: GetProfileParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProfile>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update current user profile
 */
export declare const getUpdateProfileUrl: () => string;
export declare const updateProfile: (profileUpdate: ProfileUpdate, options?: RequestInit) => Promise<Profile>;
export declare const getUpdateProfileMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProfile>>, TError, {
        data: BodyType<ProfileUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateProfile>>, TError, {
    data: BodyType<ProfileUpdate>;
}, TContext>;
export type UpdateProfileMutationResult = NonNullable<Awaited<ReturnType<typeof updateProfile>>>;
export type UpdateProfileMutationBody = BodyType<ProfileUpdate>;
export type UpdateProfileMutationError = ErrorType<unknown>;
/**
 * @summary Update current user profile
 */
export declare const useUpdateProfile: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProfile>>, TError, {
        data: BodyType<ProfileUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateProfile>>, TError, {
    data: BodyType<ProfileUpdate>;
}, TContext>;
/**
 * @summary Get top users leaderboard
 */
export declare const getGetLeaderboardUrl: (params?: GetLeaderboardParams) => string;
export declare const getLeaderboard: (params?: GetLeaderboardParams, options?: RequestInit) => Promise<LeaderboardEntry[]>;
export declare const getGetLeaderboardQueryKey: (params?: GetLeaderboardParams) => readonly ["/api/leaderboard", ...GetLeaderboardParams[]];
export declare const getGetLeaderboardQueryOptions: <TData = Awaited<ReturnType<typeof getLeaderboard>>, TError = ErrorType<unknown>>(params?: GetLeaderboardParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLeaderboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getLeaderboard>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetLeaderboardQueryResult = NonNullable<Awaited<ReturnType<typeof getLeaderboard>>>;
export type GetLeaderboardQueryError = ErrorType<unknown>;
/**
 * @summary Get top users leaderboard
 */
export declare function useGetLeaderboard<TData = Awaited<ReturnType<typeof getLeaderboard>>, TError = ErrorType<unknown>>(params?: GetLeaderboardParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLeaderboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List cards with pagination and filtering
 */
export declare const getListCardsUrl: (params?: ListCardsParams) => string;
export declare const listCards: (params?: ListCardsParams, options?: RequestInit) => Promise<CardsPage>;
export declare const getListCardsQueryKey: (params?: ListCardsParams) => readonly ["/api/cards", ...ListCardsParams[]];
export declare const getListCardsQueryOptions: <TData = Awaited<ReturnType<typeof listCards>>, TError = ErrorType<unknown>>(params?: ListCardsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCards>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listCards>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListCardsQueryResult = NonNullable<Awaited<ReturnType<typeof listCards>>>;
export type ListCardsQueryError = ErrorType<unknown>;
/**
 * @summary List cards with pagination and filtering
 */
export declare function useListCards<TData = Awaited<ReturnType<typeof listCards>>, TError = ErrorType<unknown>>(params?: ListCardsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCards>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get recent chat messages
 */
export declare const getGetChatMessagesUrl: (params?: GetChatMessagesParams) => string;
export declare const getChatMessages: (params?: GetChatMessagesParams, options?: RequestInit) => Promise<ChatMessage[]>;
export declare const getGetChatMessagesQueryKey: (params?: GetChatMessagesParams) => readonly ["/api/chat/messages", ...GetChatMessagesParams[]];
export declare const getGetChatMessagesQueryOptions: <TData = Awaited<ReturnType<typeof getChatMessages>>, TError = ErrorType<unknown>>(params?: GetChatMessagesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getChatMessages>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getChatMessages>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetChatMessagesQueryResult = NonNullable<Awaited<ReturnType<typeof getChatMessages>>>;
export type GetChatMessagesQueryError = ErrorType<unknown>;
/**
 * @summary Get recent chat messages
 */
export declare function useGetChatMessages<TData = Awaited<ReturnType<typeof getChatMessages>>, TError = ErrorType<unknown>>(params?: GetChatMessagesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getChatMessages>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Send a chat message
 */
export declare const getSendMessageUrl: () => string;
export declare const sendMessage: (messageInput: MessageInput, options?: RequestInit) => Promise<ChatMessage>;
export declare const getSendMessageMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendMessage>>, TError, {
        data: BodyType<MessageInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof sendMessage>>, TError, {
    data: BodyType<MessageInput>;
}, TContext>;
export type SendMessageMutationResult = NonNullable<Awaited<ReturnType<typeof sendMessage>>>;
export type SendMessageMutationBody = BodyType<MessageInput>;
export type SendMessageMutationError = ErrorType<unknown>;
/**
 * @summary Send a chat message
 */
export declare const useSendMessage: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendMessage>>, TError, {
        data: BodyType<MessageInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof sendMessage>>, TError, {
    data: BodyType<MessageInput>;
}, TContext>;
/**
 * @summary Get site-wide statistics
 */
export declare const getGetSiteStatsUrl: () => string;
export declare const getSiteStats: (options?: RequestInit) => Promise<SiteStats>;
export declare const getGetSiteStatsQueryKey: () => readonly ["/api/stats"];
export declare const getGetSiteStatsQueryOptions: <TData = Awaited<ReturnType<typeof getSiteStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSiteStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSiteStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSiteStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getSiteStats>>>;
export type GetSiteStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get site-wide statistics
 */
export declare function useGetSiteStats<TData = Awaited<ReturnType<typeof getSiteStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSiteStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get trending anime from Anilist
 */
export declare const getGetTrendingAnimeUrl: (params?: GetTrendingAnimeParams) => string;
export declare const getTrendingAnime: (params?: GetTrendingAnimeParams, options?: RequestInit) => Promise<AnimeEntry[]>;
export declare const getGetTrendingAnimeQueryKey: (params?: GetTrendingAnimeParams) => readonly ["/api/anime/trending", ...GetTrendingAnimeParams[]];
export declare const getGetTrendingAnimeQueryOptions: <TData = Awaited<ReturnType<typeof getTrendingAnime>>, TError = ErrorType<unknown>>(params?: GetTrendingAnimeParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTrendingAnime>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTrendingAnime>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetTrendingAnimeQueryResult = NonNullable<Awaited<ReturnType<typeof getTrendingAnime>>>;
export type GetTrendingAnimeQueryError = ErrorType<unknown>;
/**
 * @summary Get trending anime from Anilist
 */
export declare function useGetTrendingAnime<TData = Awaited<ReturnType<typeof getTrendingAnime>>, TError = ErrorType<unknown>>(params?: GetTrendingAnimeParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTrendingAnime>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get a set of featured Pokémon from PokeAPI
 */
export declare const getGetFeaturedPokemonUrl: () => string;
export declare const getFeaturedPokemon: (options?: RequestInit) => Promise<PokemonEntry[]>;
export declare const getGetFeaturedPokemonQueryKey: () => readonly ["/api/pokemon/featured"];
export declare const getGetFeaturedPokemonQueryOptions: <TData = Awaited<ReturnType<typeof getFeaturedPokemon>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFeaturedPokemon>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getFeaturedPokemon>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetFeaturedPokemonQueryResult = NonNullable<Awaited<ReturnType<typeof getFeaturedPokemon>>>;
export type GetFeaturedPokemonQueryError = ErrorType<unknown>;
/**
 * @summary Get a set of featured Pokémon from PokeAPI
 */
export declare function useGetFeaturedPokemon<TData = Awaited<ReturnType<typeof getFeaturedPokemon>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFeaturedPokemon>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map