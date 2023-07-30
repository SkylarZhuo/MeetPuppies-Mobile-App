# MeetPuppies

## Team members:
- Xiaoyu(Carlin) Huang
- Zhen(Jesse) Zhang
- Zhuohang(Skylar) Li

## Mobile App Introduction
### App Name:
**MeetPuppies**
### App introduction
The app is designed for the puppies and their owners to build socialised
relationships with others. Especially for the post-pandemic time, the app is aiming at
helping puppies to socialise, and recover from the isolated lifestyle.
Users will build the profile and also the profile for their puppies, and create events for
puppies to join.
- **Innovation**: we care about dogs’ mental health and we also pay attention to security
issues( we will limit the event locations set to a public dog run, and enable an alert
function)
- **Elegant part**: we will give out badges for puppies that conveyed high-quality social
events with others.

### Development Environment
- Platform: IOS/ANDROID
- Frontend: ReactNative
- Backend: Firebase

### Demo 
https://www.youtube.com/watch?v=vOpl3crEcc8

### Screens 
1. Login/SignUp
2. Home 
- Discover Events 
- Create Events 
- Me
3. EventDetails
4. EditEvent
5. EditProfile
6. OtherUser

## Iterations
### Iteration1
In the first iteration, we finished the tasks:
1. Build Mobile app structue
2. Finish Navigations between screens
3. Develop functions based on the proposal, finish the basic CRUD operations of our app.

#### Xiaoyu Huang
- Firebase set up and connection. Over all navigation and Home Tab navigation
- Create Event screen with validation.
- EditEvents screen
- Conditional Rendering for Pressables in EventDetail Screen
- Account page with user information and Events user posted and signed up.

#### Zhen Zhang
- AllEvent screen with list of all the events. 
- Navigation of All Event screen. Pressing the overview of a event navigates to EventDetail screen accordingly.
- EventDatail with Host and Going avatars. 
- Show list of Going person when user clicks the icon next to 'Going' in the EventDetail screen
- Delete Event.

#### Zhuohang Li
- Sign up, login and logout screens and Authentication set up
- Stored firebase authentication user id into "User" collection of firestore when user register
- Edit profile screen
- Image uploading-Add ImageManager
- editting avatar in EditProfile screen (not finished, in process)

### Iteration2
In the second iteration, we're going to finish the tasks as followed:
1. Add update location and avatar feature in EditProfile page
2. Add post events and event history on Profile page. Update avatar on Profile page
3. Add Google Map API and calender in Create Event page.

#### Xiaoyu Huang
- Add date and time picker in create event.
- Add event key into HostEvent/JoinEvent field of user in firestore. Delete accordingly when user delete the event.

#### Zhen Zhang
- Add Google Map API in EditProfile.
- Add location to database when user create a new event.

#### Zhuohang Li
- Finish Edit Profile page: Allow users take image or upload avatar from local gallery
- Add new avatar to firestore database.

### Iteration3
1. Stylechange and UI improvement
2. Other user screen 
#### Xiaoyu Huang
- Show posted and join events in user account page
- Stylechange 
#### Zhen Zhang
- Show other users' information when we click the users' avatar 
- Stylechange
#### Zhuohang Li
- Notification
- Stylechange 


## To Run the App

copy the github link in the terminal: 
```
git clone --branch iteration2 https://github.com/carlinhuang/MeetPuppies.git
```

Change the directory to iteration1
```
cd MeetPuppies
```
Install all the dependencies:
```
npm install --force
```
Run the react app:
```
npm start

