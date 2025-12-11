import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService
{
    private _authenticated: boolean = false;
    private readonly _apiUrl = 'http://localhost:8000';

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    /**
     * Setter & getter for user ID (needed for refresh token requests)
     */
    set userId(id: string)
    {
        localStorage.setItem('userId', id);
    }

    get userId(): string
    {
        return localStorage.getItem('userId') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any>
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post(`${this._apiUrl}/auth/login`, credentials, {
            withCredentials: true // Important for cookies
        }).pipe(
            switchMap((response: any) =>
            {
                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                // Store user ID for refresh token requests
                this.userId = response.user.id;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return a new observable with the response
                return of(response);
            }),
        );
    }

    /**
     * Refresh access token using refresh token from cookie
     */
    refreshToken(): Observable<any>
    {
        const userId = this.userId;
        if (!userId)
        {
            return throwError('No user ID available for token refresh');
        }

        return this._httpClient.post(`${this._apiUrl}/auth/refresh`, { userId }, {
            withCredentials: true // Important for cookies
        }).pipe(
            switchMap((response: any) =>
            {
                // Store the new access token
                if (response.accessToken)
                {
                    this.accessToken = response.accessToken;
                }

                // Set the authenticated flag to true
                this._authenticated = true;

                // Return the response
                return of(response);
            }),
            catchError((error) =>
            {
                // If refresh fails, sign out the user
                this.signOut().subscribe();
                return throwError(error);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        const userId = this.userId;

        // Call backend logout endpoint if user ID is available
        const logout$ = userId 
            ? this._httpClient.post(`${this._apiUrl}/auth/logout`, { userId }, {
                withCredentials: true // Important for cookies
              })
            : of(null);

        return logout$.pipe(
            switchMap(() =>
            {
                // Remove the access token and user ID from local storage
                localStorage.removeItem('accessToken');
                localStorage.removeItem('userId');

                // Set the authenticated flag to false
                this._authenticated = false;

                // Return the observable
                return of(true);
            }),
            catchError(() =>
            {
                // Even if logout fails, clear local state
                localStorage.removeItem('accessToken');
                localStorage.removeItem('userId');
                this._authenticated = false;
                return of(true);
            })
        );
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string }): Observable<any>
    {
        return this._httpClient.post(`${this._apiUrl}/auth/register`, user);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            // Try to refresh the token
            return this.refreshToken().pipe(
                switchMap(() => of(true)),
                catchError(() => of(false))
            );
        }

        // If the access token exists and didn't expire, user is authenticated
        this._authenticated = true;
        return of(true);
    }
}
