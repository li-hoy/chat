const shared_data = {
    user : {
        id: document.querySelector('#user_id')?.value,
    },
    current_recipient_id: null,
    message_feed: [],
    chats: {},
    contacts: [],
};

export default shared_data;