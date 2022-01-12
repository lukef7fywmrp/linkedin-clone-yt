import { Avatar, IconButton } from "@mui/material";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ThumbUpOffAltOutlinedIcon from "@mui/icons-material/ThumbUpOffAltOutlined";
import ThumbUpOffAltRoundedIcon from "@mui/icons-material/ThumbUpOffAltRounded";
import { useRecoilState } from "recoil";
import { handlePostState, getPostState } from "../atoms/postAtom";
import { useState } from "react";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import { modalState, modalTypeState } from "../atoms/modalAtom";
import TimeAgo from "timeago-react";
import { useSession } from "next-auth/react";

function Post({ post, modalPost }) {
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useRecoilState(modalState);
  const [modalType, setModalType] = useRecoilState(modalTypeState);
  const [postState, setPostState] = useRecoilState(getPostState);
  const [showInput, setShowInput] = useState(false);
  const [liked, setLiked] = useState(false);
  const [handlePost, setHandlePost] = useRecoilState(handlePostState);

  const truncate = (string, n) =>
    string?.length > n ? string.substr(0, n - 1) + "...see more" : string;

  const deletePost = async () => {
    const response = await fetch(`/api/posts/${post._id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    setHandlePost(true);
    setModalOpen(false);
  };

  return (
    <div
      className={`bg-white dark:bg-[#1D2226] ${
        modalPost ? "rounded-r-lg" : "rounded-lg"
      } space-y-2 py-2.5 border border-gray-300 dark:border-none`}
    >
      <div className="flex items-center px-2.5 cursor-pointer">
        <Avatar src={post.userImg} className="!h-10 !w-10 cursor-pointer" />
        <div className="mr-auto ml-2 leading-none">
          <h6 className="font-medium hover:text-blue-500 hover:underline">
            {post.username}
          </h6>
          <p className="text-sm dark:text-white/75 opacity-80">{post.email}</p>
          <TimeAgo
            datetime={post.createdAt}
            className="text-xs dark:text-white/75 opacity-80"
          />
        </div>
        {modalPost ? (
          <IconButton onClick={() => setModalOpen(false)}>
            <CloseRoundedIcon className="dark:text-white/75 h-7 w-7" />
          </IconButton>
        ) : (
          <IconButton>
            <MoreHorizRoundedIcon className="dark:text-white/75 h-7 w-7" />
          </IconButton>
        )}
      </div>

      {post.input && (
        <div className="px-2.5 break-all md:break-normal">
          {modalPost || showInput ? (
            <p onClick={() => setShowInput(false)}>{post.input}</p>
          ) : (
            <p onClick={() => setShowInput(true)}>
              {truncate(post.input, 150)}
            </p>
          )}
        </div>
      )}

      {post.photoUrl && !modalPost && (
        <img
          src={post.photoUrl}
          alt=""
          className="w-full cursor-pointer"
          onClick={() => {
            setModalOpen(true);
            setModalType("gifYouUp");
            setPostState(post);
          }}
        />
      )}

      <div className="flex justify-evenly items-center dark:border-t border-gray-600/80 mx-2.5 pt-2 text-black/60 dark:text-white/75">
        {modalPost ? (
          <button className="postButton">
            <CommentOutlinedIcon />
            <h4>Comment</h4>
          </button>
        ) : (
          <button
            className={`postButton ${liked && "text-blue-500"}`}
            onClick={() => setLiked(!liked)}
          >
            {liked ? (
              <ThumbUpOffAltRoundedIcon className="-scale-x-100" />
            ) : (
              <ThumbUpOffAltOutlinedIcon className="-scale-x-100" />
            )}

            <h4>Like</h4>
          </button>
        )}

        {session?.user?.email === post.email ? (
          <button
            className="postButton focus:text-red-400"
            onClick={deletePost}
          >
            <DeleteRoundedIcon />
            <h4>Delete post</h4>
          </button>
        ) : (
          <button className="postButton ">
            <ReplyRoundedIcon className="-scale-x-100" />
            <h4>Share</h4>
          </button>
        )}
      </div>
    </div>
  );
}

export default Post;
