package com.chuntung.demo;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class DownloadServlet
 */
public class DownloadServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private static final String TOKEN = "_downloadToken";
	private static final String WAIT_TIME = "waitTime";

	public DownloadServlet() {
		super();
	}

	private void writeBinary(int seconds, HttpServletResponse response) {
		response.setHeader("Content-disposition", "attachment; filename=test.zip");
		response.setContentType("application/octet-stream");
		response.setCharacterEncoding("UTF-8");
		try {
			Thread.sleep(seconds * 1000);
		} catch (InterruptedException e) {
			// N/A
		}
	}

	private int getWaitTime(HttpServletRequest request) {
		String waitTime = request.getParameter(WAIT_TIME);
		if (waitTime != null && !waitTime.isEmpty()) {
			return Integer.valueOf(waitTime);
		} else {
			return 3;
		}
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String token = request.getParameter(TOKEN);
		Cookie cookie = new Cookie(TOKEN, token);
		response.addCookie(cookie);
		writeBinary(getWaitTime(request), response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String token = request.getParameter(TOKEN);
		Cookie cookie = new Cookie(TOKEN, token);
		response.addCookie(cookie);
		writeBinary(getWaitTime(request), response);
	}

}
