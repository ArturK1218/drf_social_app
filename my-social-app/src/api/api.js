import api from './axios';

export const login = (data) => api.post('users/token/', data);
export const register = (data) => api.post('users/register/', data);
export const getProfile = () => api.get('users/profile/');
export const updateProfile = (data) => api.put('users/profile/', data);

export const getPosts = () => api.get('posts/post/');
export const createPost = (data) => api.post('posts/post/', data);
export const deletePost = (id) => api.delete(`posts/post/${id}/`);

export const getGroups = () => api.get('groups/groups/');
export const createGroup = (data) => api.post('groups/groups/', data);

export const getFeed = () => api.get('feed/feed/');
export const getDialogs = () => api.get('dialogs/');
export const getDialog = (id) => api.get(`dialogs/${id}/`);