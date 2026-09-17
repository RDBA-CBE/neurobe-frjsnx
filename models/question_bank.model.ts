import { commonInstance } from '@/utils/axios.utils';

const question_bank = {

    question_list: (body) => {
        let promise = new Promise((resolve, reject) => {
            let url = `course/mcq/history/questions`;
            commonInstance()
                .get(url)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    if (error.response) {
                        reject(error.response.data?.message || error.response.data);
                    } else {
                        reject(error);
                    }
                });
        });
        return promise;
    },

    approve_question: (question_id,body) => {
        let promise = new Promise((resolve, reject) => {
            let url = `course/mcq/history/questions/${question_id}`;
            commonInstance()
                .put(url,body)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    if (error.response) {
                        reject(error.response.data?.message || error.response.data);
                    } else {
                        reject(error);
                    }
                });
        });
        return promise;
    },

    generate: (data) => {
        let promise = new Promise((resolve, reject) => {
            let url = `course/mcq/generate`;
            
            commonInstance()
                .post(url,data)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    if (error.response) {
                        reject(error.response.data?.message || error.response.data);
                    } else {
                        reject(error);
                    }
                });
        });
        return promise;
    },

    detail: (question_id) => {
        let promise = new Promise((resolve, reject) => {
            let url = `course/mcq/history/questions/${question_id}`;
            
            commonInstance()
                .get(url)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    if (error.response) {
                        reject(error.response.data?.message || error.response.data);
                    } else {
                        reject(error);
                    }
                });
        });
        return promise;
    },

    update: (question_id, data) => {
        let promise = new Promise((resolve, reject) => {
            let url = `course/mcq/history/questions/${question_id}`;
            
            commonInstance()
                .put(url, data)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    if (error.response) {
                        reject(error.response.data?.message || error.response.data);
                    } else {
                        reject(error);
                    }
                });
        });
        return promise;
    },
 

     get_topics: (topic_id: string | number) => {
        let promise = new Promise((resolve, reject) => {
            let url = `course/topics/${topic_id}/learning-materials`;
            commonInstance()
                .get(url)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    if (error.response) {
                        reject(error.response.data?.message || error.response.data);
                    } else {
                        reject(error);
                    }
                });
        });
        return promise;
    },

    update_topics: (topic_id: string | number,data) => {
        let promise = new Promise((resolve, reject) => {
            let url = `course/topics/${topic_id}/lesson-plan-item`;
            commonInstance()
                .put(url,data)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    if (error.response) {
                        reject(error.response.data?.message || error.response.data);
                    } else {
                        reject(error);
                    }
                });
        });
        return promise;
    },

     update_material: (topic_id: string | number,data) => {
        let promise = new Promise((resolve, reject) => {
            let url = `course/topics/${topic_id}/learning-materials`;
            commonInstance()
                .put(url,data)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    if (error.response) {
                        reject(error.response.data?.message || error.response.data);
                    } else {
                        reject(error);
                    }
                });
        });
        return promise;
    },

      approve_material: (topic_id: string | number) => {
        let promise = new Promise((resolve, reject) => {
            let url = `course/topics/${topic_id}/learning-materials/approve`;
            commonInstance()
                .post(url)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    if (error.response) {
                        reject(error.response.data?.message || error.response.data);
                    } else {
                        reject(error);
                    }
                });
        });
        return promise;
    },



    

   


    
};

export default question_bank;
