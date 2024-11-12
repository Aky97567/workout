// src/widgets/user-menu/ui/UserMenu.tsx
import { useState, useRef, useEffect } from "react";
import { UserCircle } from "lucide-react";
import {
  UserMenuContainer,
  UserMenuButton,
  UserMenuDropdown,
  UserMenuItem,
  UserInfo,
} from "./UserMenu.styles";

interface UserMenuProps {
  name: string;
  email: string;
  onSignOut: () => void;
}

export const UserMenu = ({ name, email, onSignOut }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <UserMenuContainer ref={menuRef}>
      <UserMenuButton onClick={() => setIsOpen(!isOpen)}>
        <UserCircle size={24} />
        <span>{name}</span>
      </UserMenuButton>
      {isOpen && (
        <UserMenuDropdown>
          <UserInfo>
            <div className="name">{name}</div>
            <div className="email">{email}</div>
          </UserInfo>
          <UserMenuItem onClick={onSignOut}>Sign Out</UserMenuItem>
        </UserMenuDropdown>
      )}
    </UserMenuContainer>
  );
};
