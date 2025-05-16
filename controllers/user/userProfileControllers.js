import UserProfiles from '../../services/user/userProfiles.js';

// Create user profile
export async function createUserProfile(req, res, next) {
  const { id } = req.user;
  const { first_name, 
    last_name, 
    height, 
    weight, 
    age, 
    gender, 
    goal, 
    activity_level 
  } = req.body;
  try {
    const missingFields = getMissingFields(req.body, ['first_name', 'last_name', 'height', 'weight', 'age', 'gender', 'goal', 'activity_level']);
    if (missingFields.length > 0) {
      throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
    };

    const result = await UserProfiles.addUserProfile(id, first_name, last_name, height, weight, age, gender, goal, activity_level);
    if (!result) {
      throw new ApiError(500, `Profile has not been created`);
    };

    return ApiSuccess(res, 201, {}, 'Profile has been created');
  } catch (error) {
    next(error);
  }
}

// Get user profile
export async function getUserProfile(req, res, next) {
  const { id } = req.user;
  try {
    const profile = await UserProfiles.getUserProfileInfo(id);

    return ApiSuccess(res, 200, { profile }, 'Profile has been retrieved');
  } catch (error) {
    next(error);
  }
}

// Update user profile
export async function updateUserProfile(req, res, next) {
  const { id } = req.user;
  const { first_name, 
    last_name, 
    height, 
    weight, 
    age, 
    gender, 
    goal, 
    activity_level 
  } = req.body;
  try {
    const missingFields = getMissingFields(req.body, ['first_name', 'last_name', 'height', 'weight', 'age', 'gender', 'goal', 'activity_level']);
    if (missingFields.length > 0) {
      throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
    };

    const result = await UserProfiles.updateUserProfile(id, first_name, last_name, height, weight, age, gender, goal, activity_level);
    if (!result) {
      throw new ApiError(500, `Profile has not been updated`);
    };

    return ApiSuccess(res, 200, {}, 'Profile has been updated');
  } catch (error) {
    next(error);
  }
}

// Delete user profile
export async function deleteUserProfile(req, res, next) {
  const { id } = req.user;
  try {
    const result = await UserProfiles.deleteUserProfile(id);
    if (!result) {
      throw new ApiError(500, `Profile has not been deleted`);
    };

    return ApiSuccess(res, 200, {}, 'Profile has been deleted');
  } catch (error) {
    next(error);
  }
}
