import _ from '@lodash';
import { PartialDeep } from 'type-fest';
import { Contact, ContactEmail, ContactPhoneNumber } from '../ContactsApi';

/**
 * The contact phone number model.
 */
export const ContactPhoneModel = (data: PartialDeep<ContactPhoneNumber> | null): ContactPhoneNumber =>
	_.defaults(data || {}, {
		country: '',
		phoneNumber: '',
		label: ''
	});

/**
 * The contact email model.
 */
export const ContactEmailModel = (data: Partial<ContactEmail> | null): ContactEmail =>
	_.defaults(data || {}, {
		email: '',
		label: ''
	});

/**
 * The contact model.
 */
const ContactModel = (data: PartialDeep<Contact>): Contact =>
	_.defaults(data || {}, {
		userId: _.uniqueId(),
		avatar: '',
		background: '',
		fullName: '',
		emails: [ContactEmailModel(null)],
		phoneNumbers: [ContactPhoneModel(null)],
		title: '',
		company: '',
		birthday: '',
		address: '',
		notes: '',
		tags: []
	});

export default ContactModel;
