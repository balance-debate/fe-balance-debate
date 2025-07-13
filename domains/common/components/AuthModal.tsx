"use client";

import { useState } from "react";
import {
  Dialog,
  Tabs,
  Tab,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useAuth } from "@/lib/api/auth";
import { useSnackbar } from "@/lib/providers/SnackbarProvider";
import { LoginRequest, SignupRequest } from "@/lib/types/api";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: "login" | "signup";
}

export function AuthModal({
  open,
  onClose,
  defaultTab = "login",
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);
  const [loginForm, setLoginForm] = useState<LoginRequest>({
    nickname: "",
    password: "",
  });
  const [signupForm, setSignupForm] = useState<SignupRequest>({
    nickname: "",
    password: "",
    confirmPassword: "",
  });

  const { useLogin, useSignup } = useAuth;
  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const { showSnackbar } = useSnackbar();

  // 모달이 닫힐 때 폼 초기화
  const handleClose = () => {
    setLoginForm({ nickname: "", password: "" });
    setSignupForm({ nickname: "", password: "", confirmPassword: "" });
    setActiveTab(defaultTab);
    onClose();
  };

  // 탭 변경 시 폼 초기화
  const handleTabChange = (
    _: React.SyntheticEvent,
    newValue: "login" | "signup"
  ) => {
    setActiveTab(newValue);
    setLoginForm({ nickname: "", password: "" });
    setSignupForm({ nickname: "", password: "", confirmPassword: "" });
  };

  // 로그인 폼 처리
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginForm.nickname.trim()) {
      showSnackbar("닉네임을 입력해주세요.", "error");
      return;
    }

    if (!loginForm.password) {
      showSnackbar("비밀번호를 입력해주세요.", "error");
      return;
    }

    try {
      const result = await loginMutation.mutateAsync(loginForm);

      if (result.statusCode === 200 && !result.code) {
        showSnackbar("로그인 성공!", "success");
        handleClose();
      } else {
        // API 에러 메시지 표시
        showSnackbar(result.message || "로그인에 실패했습니다.", "error");
      }
    } catch {
      showSnackbar("로그인 중 오류가 발생했습니다.", "error");
    }
  };

  // 회원가입 폼 처리
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signupForm.nickname.trim()) {
      showSnackbar("닉네임을 입력해주세요.", "error");
      return;
    }

    if (!signupForm.password) {
      showSnackbar("비밀번호를 입력해주세요.", "error");
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      showSnackbar("비밀번호가 일치하지 않습니다.", "error");
      return;
    }

    try {
      const result = await signupMutation.mutateAsync({
        nickname: signupForm.nickname,
        password: signupForm.password,
      });

      if (result.statusCode === 200 && !result.code) {
        showSnackbar("회원가입 성공!", "success");
        handleClose();
      } else {
        // API 에러 메시지 표시
        showSnackbar(result.message || "회원가입에 실패했습니다.", "error");
      }
    } catch {
      showSnackbar("회원가입 중 오류가 발생했습니다.", "error");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: 400,
        },
      }}
    >
      <Box sx={{ position: "relative", p: 3 }}>
        {/* 닫기 버튼 */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* 탭 영역 */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3, pr: 5 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
          >
            <Tab label="로그인" value="login" />
            <Tab label="회원가입" value="signup" />
          </Tabs>
        </Box>

        {/* 로그인 폼 */}
        {activeTab === "login" && (
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
            <Typography
              variant="h5"
              sx={{ mb: 3, textAlign: "center", fontWeight: 600 }}
            >
              로그인
            </Typography>

            <TextField
              fullWidth
              label="닉네임"
              value={loginForm.nickname}
              onChange={(e) =>
                setLoginForm((prev) => ({ ...prev, nickname: e.target.value }))
              }
              margin="normal"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="비밀번호"
              type="password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm((prev) => ({ ...prev, password: e.target.value }))
              }
              margin="normal"
              variant="outlined"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "로그인 중..." : "로그인"}
            </Button>
          </Box>
        )}

        {/* 회원가입 폼 */}
        {activeTab === "signup" && (
          <Box component="form" onSubmit={handleSignup} sx={{ mt: 2 }}>
            <Typography
              variant="h5"
              sx={{ mb: 3, textAlign: "center", fontWeight: 600 }}
            >
              회원가입
            </Typography>

            <TextField
              fullWidth
              label="닉네임"
              value={signupForm.nickname}
              onChange={(e) =>
                setSignupForm((prev) => ({ ...prev, nickname: e.target.value }))
              }
              margin="normal"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="비밀번호"
              type="password"
              value={signupForm.password}
              onChange={(e) =>
                setSignupForm((prev) => ({ ...prev, password: e.target.value }))
              }
              margin="normal"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="비밀번호 확인"
              type="password"
              value={signupForm.confirmPassword}
              onChange={(e) =>
                setSignupForm((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              margin="normal"
              variant="outlined"
              error={
                signupForm.confirmPassword !== "" &&
                signupForm.password !== signupForm.confirmPassword
              }
              helperText={
                signupForm.confirmPassword !== "" &&
                signupForm.password !== signupForm.confirmPassword
                  ? "비밀번호가 일치하지 않습니다."
                  : ""
              }
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? "회원가입 중..." : "회원가입"}
            </Button>
          </Box>
        )}
      </Box>
    </Dialog>
  );
}
