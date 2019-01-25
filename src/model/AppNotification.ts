/**
 * Represents internal notification system of the application.
 *
 * Notifications can be used to facilitate communication between components which cannot be expressed in terms of data
 * stored in Redux store.
 */
export default interface AppNotification {
    source: any;
}