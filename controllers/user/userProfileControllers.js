import UserProfiles from '../../services/user/userProfiles.js';

// Create user profile
export async function createUserProfile(req, res) {
  const { id } = req.user;
  const { first_name, last_name, height, weight, age, gender, goal, activity_level } = req.body;
  try {
    const result = await UserProfiles.addUserProfile(id, first_name, last_name, height, weight, age, gender, goal, activity_level);
    if (result) {
      res.status(201).json({ message: 'User profile created successfully' });
    } else {
      res.status(400).json({ message: 'Failed to create user profile' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Get user profile
export async function getUserProfile(req, res) {
  const { id } = req.user;

  if(!id){
    res.status(401).json({ message: 'Missed require fields' });
  }
  try {
    const profile = await UserProfiles.getUserProfileInfo(id);
    if (profile && profile.length > 0) {
      res.status(200).json(profile);
    } else {
      res.status(404).json({ message: 'User profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Update user profile
export async function updateUserProfile(req, res) {
  const { id } = req.user;
  const { first_name, last_name, height, weight, age, gender, goal, activity_level } = req.body;
  try {
    const result = await UserProfiles.updateUserProfile(id, first_name, last_name, height, weight, age, gender, goal, activity_level);
    if (result) {
      res.status(200).json({ message: 'User profile updated successfully' });
    } else {
      res.status(400).json({ message: 'Failed to update user profile' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete user profile
export async function deleteUserProfile(req, res) {
  const { id } = req.user;
  try {
    const result = await UserProfiles.deleteUserProfile(id);
    if (result) {
      res.status(200).json({ message: 'User profile deleted successfully' });
    } else {
      res.status(400).json({ message: 'Failed to delete user profile' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
