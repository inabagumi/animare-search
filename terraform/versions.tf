terraform {
  required_providers {
    random = {
      source  = "hashicorp/random"
      version = "3.6.3"
    }

    vercel = {
      source  = "vercel/vercel"
      version = "2.2.0"
    }
  }

  required_version = "~> 1.9"
}
