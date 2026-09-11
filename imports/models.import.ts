import auth from "@/models/auth.model";
import department from "@/models/department.model";
import programmes from "@/models/program.model";
import batches from "@/models/batch.model";
import course from "@/models/course.model";
import test from "@/models/test.model";
import stats from "@/models/stat.models";
import users from "@/models/users.model";
import course_instance from "@/models/course_instance.model";

export const Models = {
  test,
  auth,
  department,
  programme: programmes,
  programmes,
  batch: batches,
  batches,
  course,
  course_instance,
  stats,
  users
};

export default Models;
