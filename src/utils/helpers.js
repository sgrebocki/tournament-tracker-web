export const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = date.toLocaleDateString();
    return `${timeString}, ${dateString}`;
};