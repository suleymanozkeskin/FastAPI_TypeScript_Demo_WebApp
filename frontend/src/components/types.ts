// src/pages/forum/types.ts
export interface EntryType {
  id: number;
  title: string;
  content: string;
  tag: string;
  owner_username: string;
  likes: number;
  dislikes: number;
  owner?: {
    id: number;
    email: string;
    username: string;
    created_at: string;
  };
  created_at: string;
}


export interface CommentType {
  entry_id: number;
  id: number;
  content: string;
  created_at: string;
  likes: number;
  dislikes: number;
  owner?: {
    id: number;
    email: string;
    username: string;
    created_at: string;
  };
}


export type EntryWithComments = {
  entry: EntryType;
  comments: CommentType[];
  total_comments: number;
};

export interface ShowEntry {
  id: number;
  title: string;
  content: string;
  tag: string;
  likes: number;
  dislikes: number;
  created_at: string;
  owner_username: string;
}

export interface ShowComment {
  id: number;
  content: string;
  likes: number;
  dislikes: number;
  created_at: string;
  owner_username: string;
  entry_id: number;
}

export type SearchResult =
  | { type: "entry"; data: ShowEntry | EntryType }
  | { type: "comment"; data: ShowComment | CommentType };


export interface TopbarProps {
  searchResults: (EntrySearchResult | CommentSearchResult)[];
  setSearchResults: (searchResults: (EntrySearchResult | CommentSearchResult)[]) => void;
}

export type EntrySearchResult = EntryType & {
  type: "entry";
  entry?: never;
};

export type CommentSearchResult = CommentType & {
  type: "comment";
  entry?: EntryType;
};



export interface EventImage {
  id: number;
  image_path: string;
  image_file_type: string;
}

export interface Ticket {
  id: number;
  name: string;
  price: number;
  available_quantity: number;
}

export interface Event {
  id: number;
  title: string;
  content: string;
  date: string;
  organizer_id: number;
  organizer_name: string;
  created_at: string;
  is_free: boolean;
  images: EventImage[];
  tickets: Ticket[];
}
