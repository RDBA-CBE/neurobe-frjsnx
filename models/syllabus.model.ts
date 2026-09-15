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

};

export default syllabus;