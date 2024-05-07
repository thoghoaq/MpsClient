/**
 * The authRoles object defines the authorization roles for the Fuse application.
 */
const authRoles = {
	/**
	 * The admin role grants access to users with the 'admin' role.
	 */
	admin: ['Admin'],

	/**
	 * The staff role grants access to users with the 'admin' or 'staff' role.
	 */
	supplier: ['Admin', 'Supplier'],

	/**
	 * The user role grants access to users with the 'admin', 'staff', or 'user' role.
	 */
	customer: ['Admin', 'Supplier', 'Customer'],

	/**
	 * The onlyGuest role grants access to unauthenticated users.
	 */
	onlyGuest: []
};

export default authRoles;
