import { commonInstance } from '@/utils/axios.utils';

const syllabus = {

    create: (data: any) => {
        let promise = new Promise((resolve, reject) => {
            let url = `course/syllabi/ai-intake`;
            commonInstance()
                .post(url, data, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
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

    detail: (id: string | number) => {
        let promise = new Promise((resolve, reject) => {
            let url = `syllabi/${id}`;
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

    status: (syllabus_id: string | number) => {
        let promise = new Promise((resolve, reject) => {
            let url = `syllabi/${syllabus_id}/extraction`;
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

    create_unit_topic: (unit_id: string | number, data: any) => {
        let promise = new Promise((resolve, reject) => {
            let url = `course/units/${unit_id}/topics`;
            commonInstance()
                .post(url, data)
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

      delete_unit_topic: (unit_id: string | number) => {
        let promise = new Promise((resolve, reject) => {
            let url = `course/units/${unit_id}`;
            commonInstance()
                .delete(url)
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

export default syllabus;
