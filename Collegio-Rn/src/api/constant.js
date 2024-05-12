import images from '../assets/images';
import {
  DarkA,
  DarkComment,
  DarkLike,
  DarkS,
  LightA,
  LightComment,
  LightLike,
  LightS,
} from '../assets/svgs';
import {moderateScale} from '../common/constants';
import strings from '../i18n/strings';
import {StackNav} from '../navigation/NavigationKeys';

export const OnBoardingData = [
  {
    image: images.onBoarding1,
    title: 'Take Pictures. Make Memories.',
    des: 'We believe your college or university memories are important to you.',
  },
  {
    image: images.onBoarding2,
    title: 'Save Pictures. Save Memories.',
    des: 'We believe in making & saving memories.',
  },
  {
    image: images.onBoarding3,
    title: 'Privacy Protection is our first Priority.',
    des: 'Our Priority is your privacy.Your images will be shared without your consent.',
  },
  {
    image: images.onBoarding4,
    title: 'Free Unlimited Storage Space.',
    des: 'We offer free unlimited storage space to save your memories.',
  },
];

export const countryData = [
  {label: 'America', value: 'America'},
  {label: 'India', value: 'India'},
  {label: 'China', value: 'China'},
  {label: 'USA', value: 'USA'},
  {label: 'UK', value: 'UK'},
  {label: 'Japan', value: 'Japan'},
  {label: 'Germany', value: 'Germany'},
];

export const instituteData = [
  {label: 'Red & White', value: 'Red & White'},
  {label: 'Creative', value: 'Creative'},
  {label: 'Lope', value: 'Lope'},
  {label: 'Webapp', value: 'Webapp'},
  {label: 'DesignCode', value: 'DesignCode'},
];

export const studyingData = [
  {label: 'BCA', value: 'BCA'},
  {label: 'BBA', value: 'BBA'},
  {label: 'BSC', value: 'BSC'},
  {label: 'BA', value: 'BA'},
  {label: 'B.COM', value: 'B.COM'},
];

export const userStoryImageData = [
  images.userImage1,
  images.userImage2,
  images.userImage3,
  images.userImage4,
  images.userImage5,
  images.userImage6,
];

export const userPostData = [
  {
    id: 1,
    image: images.postUser1,
    name: 'Khodor Alameh',
    time: '20m ago',
    des: 'Very good day to go to uni',
    like: '2,225',
    comment: '45',
    share: '120',
  },
  {
    id: 2,
    image: images.postUser2,
    name: 'Tarek Khatib',
    time: '1h ago',
    des: 'Officially graduated!!',
    like: '8,998',
    post: [images.post1, images.post2],
    comment: '145',
    share: '12',
  },
  {
    id: 3,
    image: images.postUser4,
    name: 'Rani Hijazi',
    time: '20m ago',
    des: 'I Wish being part of antonine university',
    like: '2,225',
    comment: '45',
    share: '120',
  },
  {
    id: 4,
    image: images.postUser3,
    name: 'Mahdi Abdallah',
    time: '1h ago',
    like: '8,998',
    des: 'I Like the software developement corse in CS hahahaha',
    image: images.postUser3,
    comment: '145',
    share: '12',
  },

];

export const popularCategoriesData = [
  strings.all,
  strings.profiles,
  strings.posts,
  strings.institutes,
  strings.videos,
  strings.links,
  strings.tags,
];

export const searchData = [
  {
    id: 1,
    image: images.postUser3,
    name: 'Michelle Ogilvy',
    time: '1h ago',
    like: '18.6k',
    post: [images.post3, images.post2],
    comment: '4.7k',
    share: '12.4k',
  },
  {
    id: 2,
    image: images.postUser4,
    name: 'Brandon Loia',
    time: '1h ago',
    like: '18.6k',
    post: [images.post2, images.post1],
    comment: '4.7k',
    share: '12.4k',
  },
  {
    id: 3,
    image: images.postUser3,
    name: 'Michelle Ogilvy',
    time: '1h ago',
    like: '18.6k',
    post: [images.post3, images.post2],
    comment: '4.7k',
    share: '12.4k',
  },
  {
    id: 4,
    image: images.postUser4,
    name: 'Brandon Loia',
    time: '1h ago',
    like: '18.6k',
    post: [images.post2, images.post1],
    comment: '4.7k',
    share: '12.4k',
  },
  {
    id: 5,
    image: images.postUser3,
    name: 'Michelle Ogilvy',
    time: '1h ago',
    like: '18.6k',
    post: [images.post3, images.post2],
    comment: '4.7k',
    share: '12.4k',
  },
  {
    id: 6,
    image: images.postUser4,
    name: 'Brandon Loia',
    time: '1h ago',
    like: '18.6k',
    post: [images.post2, images.post1],
    comment: '4.7k',
    share: '12.4k',
  },
];

export const profileListData = [
  strings.posts,
  strings.stories,
  strings.liked,
  strings.tagged,
];

export const userPostDetail = [
  {
    id: 1,
    image: images.profilePhoto,
    name: 'Wadih Issa',
    time: '3d ago',
    des: 'Going on vacation! Catch you all in 10 days. No call!!!!!',
    like: '261',
    comment: '12',
  },
  {
    id: 2,
    image: images.profilePhoto,
    name: 'Wadih Issa',
    time: '4d ago',
    des: '1 day to go!',
    post: [images.post2],
    like: '261',
    comment: '12',
  },
  {
    id: 3,
    image: images.profilePhoto,
    name: 'Alex Tsimikas',
    time: '3d ago',
    des: 'Take break from life and enjoying university with collegue. 🏖️',
    like: '261',
    comment: '12',
  },

];

export const notificationData = [
  {
    title: 'Today',
    data: [
      {
        id: 1,
        darkSvgIcon: (
          <DarkLike height={moderateScale(20)} width={moderateScale(20)} />
        ),
        lightSvgIcon: (
          <LightLike height={moderateScale(22)} width={moderateScale(22)} />
        ),
        title: 'Tarek, Mahdi and +19 others liked your post.',
        time: '10m ago',
      },

    ],
  },
  {
    title: 'Yesterday',
    data: [
      {
        id: 1,
        darkSvgIcon: (
          <DarkComment height={moderateScale(22)} width={moderateScale(22)} />
        ),
        lightSvgIcon: (
          <LightComment height={moderateScale(22)} width={moderateScale(22)} />
        ),
        title: 'Khodor, Rani and +2 others commented on your post.',
        time: '1 day ago',
      },
      {
        id: 2,
        darkSvgIcon: (
          <DarkS height={moderateScale(22)} width={moderateScale(22)} />
        ),
        lightSvgIcon: (
          <LightS height={moderateScale(22)} width={moderateScale(22)} />
        ),
        title: 'Zeinab  is celebrating birthday today. Drop a wish! 🎉',
        time: '1 day ago',
      },
      {
        id: 3,
        darkSvgIcon: (
          <DarkA height={moderateScale(22)} width={moderateScale(22)} />
        ),
        lightSvgIcon: (
          <LightA height={moderateScale(22)} width={moderateScale(22)} />
        ),
        title: 'Ralph Edwards mentioned you in a post.',
        time: '1 day ago',
      },
    ],
  },
];

export const userImageData = [
  images.followUser1,
  images.followUser2,
  images.followUser3,
  images.followUser4,
];

export const commentDetail = [
  {
    id: 1,
    image: images.commentUser1,
    name: 'Jessica Thompson',
    comment: '❤️',
    time: '2m ago',
    like: '86 Likes',
  },
  {
    id: 2,
    image: images.commentUser2,
    name: 'Dustin Grant',
    comment: 'Lol 😆',
    time: '10m ago',
    like: '4 Likes',
  },
  {
    id: 3,
    image: images.commentUser3,
    name: 'Leslie Alexander',
    comment: 'Very true!',
    time: '15m ago',
    like: '19 Likes',
  },
  {
    id: 4,
    image: images.commentUser4,
    name: 'Kat Williams',
    comment: '😊',
    time: '19m ago',
    like: '177 Likes',
  },
  {
    id: 5,
    image: images.commentUser5,
    name: 'Jacob Washington',
    comment: 'This is such a powerful quote! 😁',
    time: '20m ago',
    like: '192 Likes',
  },
];

export const pinnedUserList = [
  {
    image: images.postUser4,
    name: 'Rani',
    selected: 'selected',
  },
  {
    image: images.postUser3,
    name: 'Mahdi',
  },
  {
    image: images.postUser2,
    name: 'Tarek',
    selected: 'selected',
  },
];

export const messageList = [
  {
    image: images.messageUser1,
    name: 'Mostafa Osman',
    message: 'Hey you! Are u there?',
    time: '4h ago',
    selected: 'selected',
  },
  {
    image: images.postUser1,
    name: 'Khodor Alemeh',
    message: 'OMG! OMG! OMG!',
    time: '5h ago',
  },


];

export const chatData = [
  {
    id: 1,
    message: 'Alex, let’s meet this weekend. I’ll check with Dave too 😎',
    time: '8:27 PM',
    type: 'receiver',
  },
  {
    id: 2,
    message: 'Sure. Let’s aim for saturday',
    type: 'sender',
  },
  {
    id: 3,
    message: 'I’m visiting mom this sunday 👻',
    time: '8:56 PM',
    type: 'sender',
  },
  {
    id: 4,
    message: 'Alrighty! Will give you a call shortly 🤗',
    time: '9:01 PM',
    type: 'receiver',
  },
  {
    id: 5,
    message: '❤️',
    time: '9:04 PM',
    type: 'sender',
  },
  {
    id: 6,
    message: 'Hey you! Are you there?',
    time: '11:53 AM',
    type: 'receiver',
  },
  {
    id: 5,
    message: '👋 Hi Jess! What’s up?',
    time: '12:14 PM',
    type: 'sender',
  },
];

export const settingData = [
  {id: 1, title: strings.privacySettings},
  {id: 2, title: strings.changePassword, route: StackNav.ChangePassword},
  {id: 3, title: strings.activateAccount},
  {id: 4, title: strings.darkMode},
  {id: 5, title: strings.deleteAccount, route: StackNav.DeleteAccount},
];

export const userStoryData = [
  {
    content:
      'https://user-images.githubusercontent.com/129170600/231968235-a6a60f18-6b50-459d-8c7c-9716d9df0730.mp4',
    type: 'video',
    finish: 0,
  },
  {
    content:
      'https://user-images.githubusercontent.com/129170600/231968281-f8450cd9-9adf-4002-8e77-947140fc19ec.mp4',
    type: 'video',
    finish: 0,
  },
  {
    content:
      'https://user-images.githubusercontent.com/129170600/231969921-72e1dcb1-4af6-41b9-a824-3e6b9213e872.jpeg',
    type: 'image',
    finish: 0,
  },
  {
    content:
      'https://user-images.githubusercontent.com/129170600/231969994-09ab3ca2-90c7-484e-bf91-1208f3d47ff0.jpeg',
    type: 'image',
    finish: 0,
  },
  {
    content:
      'https://user-images.githubusercontent.com/129170600/231970010-773f30db-3977-4276-a8dc-7882b54a111d.jpeg',
    type: 'image',
    finish: 0,
  },
  {
    content:
      'https://user-images.githubusercontent.com/129170600/231970027-0ee9b05e-52a6-4e77-81ae-5f38af8bf1f4.jpeg',
    type: 'image',
    finish: 0,
  },
  {
    content:
      'https://user-images.githubusercontent.com/129170600/231969248-f42e5dfd-b156-48f6-a3dc-cdfd12e3623e.mp4',
    type: 'video',
    finish: 0,
  },
  {
    content:
      'https://user-images.githubusercontent.com/129170600/231986154-36c34011-8503-43e5-85e8-d959901e5dbb.mp4',
    type: 'video',
    finish: 0,
  },
  {
    content:
      'https://user-images.githubusercontent.com/129170600/231970060-9ed373d9-bc3f-4f35-a7cb-29c01b69b792.jpeg',
    type: 'image',
    finish: 0,
  },
];
