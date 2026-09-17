import { commonInstance } from '@/utils/axios.utils';

const pedagogy = {
    

     unit_detail : (syllabus_id?: any,unit_number?: any) => {
        let promise = new Promise((resolve, reject) => {
            let url = `course/syllabi/${ syllabus_id }/pedagogy-workspace?unit_number=${unit_number}`;

            commonInstance()
                .get(url)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    if (error.response) {
                        reject(error.response.data?.message || error.response.data?.detail || error.response.data);
                    } else {
                        reject(error?.message || error);
                    }
                });
        });
        return promise;
    },

    
    generate : (syllabus_id?: any, body?: any) => { 
        let promise = new Promise((resolve, reject) => {
            let url = `course/syllabi/${syllabus_id}/generate-pedagogies`;

            const config: any = {};
            if (body instanceof FormData) {
                config.headers = { "Content-Type": "multipart/form-data" };
            }

            commonInstance()
                 .post(url, body || {}, config)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    if (error.response) {
                        reject(error.response.data?.message || error.response.data?.detail || error.response.data);
                    } else {
                        reject(error?.message || error);
                    }
                });
        });
        return promise;
    },

    update: (pedagogy_id?: any, body?: any) => { 
        let promise = new Promise((resolve, reject) => {
            let url = `course/pedagogies/${pedagogy_id}`;

            commonInstance()
                .put(url, body)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    if (error.response) {
                        reject(error.response.data?.message || error.response.data?.detail || error.response.data);
                    } else {
                        reject(error?.message || error);
                    }
                });
        });
        return promise;
    },

   

    accept: (topic_id?: any, pedagogy_id?: any, body?: any) => { 
        let promise = new Promise((resolve, reject) => {
            let url = `course/topics/${topic_id}/pedagogies/${pedagogy_id}/accept`;
            const payload = body || { is_selected: true };

            commonInstance()
                .post(url, payload)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    if (error.response) {
                        reject(error.response.data?.message || error.response.data?.detail || error.response.data);
                    } else {
                        reject(error?.message || error);
                    }
                });
        });
        return promise;
    },

    save_draft: (syllabus_id?: any, body?: any, endpoint?: any) => { 
        let promise = new Promise((resolve, reject) => {
            let url = `course/syllabi/${syllabus_id}/pedagogy/draft`;
            if (endpoint) {
                let cleaned = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
                if (cleaned.startsWith('api/v1/')) {
                    cleaned = cleaned.replace(/^api\/v1\//, 'course/');
                }
                url = cleaned;
            }

            commonInstance()
                .post(url, body || {})
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    if (error?.response?.status === 404 && url !== `course/syllabi/${syllabus_id}/pedagogy/draft`) {
                        commonInstance()
                            .post(`course/syllabi/${syllabus_id}/pedagogy/draft`, body || {})
                            .then((res) => resolve(res.data))
                            .catch((err) => {
                                reject(err?.response?.data?.message || err?.response?.data?.detail || err?.response?.data || err?.message || err);
                            });
                        return;
                    }
                    if (error.response) {
                        reject(error.response.data?.message || error.response.data?.detail || error.response.data);
                    } else {
                        reject(error?.message || error);
                    }
                });
        });
        return promise;
    },

    approve_topics: (syllabus_id?: any, body?: any, endpoint?: any) => { 
        let promise = new Promise((resolve, reject) => {
            let url = `course/syllabi/${syllabus_id}/pedagogy/complete`;
            if (endpoint) {
                let cleaned = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
                if (cleaned.startsWith('api/v1/')) {
                    cleaned = cleaned.replace(/^api\/v1\//, 'course/');
                }
                url = cleaned;
            }

            commonInstance()
                .post(url, body || {})
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    if (error?.response?.status === 404 && url !== `course/syllabi/${syllabus_id}/pedagogy/complete`) {
                        commonInstance()
                            .post(`course/syllabi/${syllabus_id}/pedagogy/complete`, body || {})
                            .then((res) => resolve(res.data))
                            .catch((err) => {
                                reject(err?.response?.data?.message || err?.response?.data?.detail || err?.response?.data || err?.message || err);
                            });
                        return;
                    }
                    if (error.response) {
                        reject(error.response.data?.message || error.response.data?.detail || error.response.data);
                    } else {
                        reject(error?.message || error);
                    }
                });
        });
        return promise;
    },

    jobStatus: (job_id?: any) => {
        let promise = new Promise((resolve, reject) => {
            let url = `course/syllabi/jobs/${job_id}`;

            commonInstance()
                .get(url)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    if (error.response) {
                        reject(error.response.data?.message || error.response.data?.detail || error.response.data);
                    } else {
                        reject(error?.message || error);
                    }
                });
        });
        return promise;
    },


}

export default pedagogy;