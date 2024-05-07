import StaffRoleExample from './StaffRoleExample';
import authRoles from '../../../auth/authRoles';

/**
 * StaffRoleExampleConfig
 */
const StaffRoleExampleConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.supplier, // ['admin','staff']
	routes: [
		{
			path: 'auth/staff-role-example',
			element: <StaffRoleExample />
		}
	]
};

export default StaffRoleExampleConfig;
