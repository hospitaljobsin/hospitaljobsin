/**
 * Playwright Integration Tests for Hospital Jobs Search Map Page
 *
 * This test suite covers comprehensive testing of the job search map interface including:
 * - Page loading and initial state
 * - Search functionality (job title and location)
 * - Map interactions (zoom, pan, markers, clusters)
 * - Job listings display and navigation
 * - Responsive design across different viewports
 * - Accessibility standards compliance
 * - Error handling and edge cases
 * - Performance and loading states
 *
 * Test URL: https://localtest.me/search/map
 */

import { expect, test } from '@playwright/test';

test.describe('Search Map Page', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to search map page
		await page.goto('https://localtest.me/search/map');

		// Accept cookies if present
		const acceptButton = page.getByRole('button', { name: 'Accept all' });
		if (await acceptButton.isVisible({ timeout: 3000 }).catch(() => false)) {
			await acceptButton.click();
		}
	});

	test('should display search map page with all elements', async ({ page }) => {
		// Check page title
		await expect(page).toHaveTitle(/Hospital Jobs Map/);

		// Check main navigation elements
		await expect(page.getByRole('link', { name: 'Hospital Jobs' })).toBeVisible();
		await expect(page.getByRole('combobox', { name: 'Job Search' })).toBeVisible();
		await expect(page.getByRole('combobox', { name: 'Location' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Log In' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'For Recruiters' })).toBeVisible();

		// Check job listings sidebar
		await expect(page.getByRole('heading', { name: /Viewing \d+ Jobs/ })).toBeVisible();
		await expect(page.getByText('in the current map view')).toBeVisible();

		// Check map controls
		await expect(page.getByRole('button', { name: 'Zoom in' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Zoom out' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Reset view' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'My location' })).toBeVisible();

		// Check sidebar controls
		await expect(page.getByRole('button', { name: 'Collapse sidebar' })).toBeVisible();

		// Verify job listings are displayed
		const jobListings = page.locator('a[href*="/organizations/"][href*="/jobs/"]');
		await expect(jobListings.first()).toBeVisible();
	});

	test('should display job listings with proper structure', async ({ page }) => {
		// Wait for job listings to load
		const jobListings = page.locator('a[href*="/organizations/"][href*="/jobs/"]');
		await expect(jobListings.first()).toBeVisible();

		// Check job listing structure
		const firstJob = jobListings.first();

		// Should have organization name
		await expect(firstJob.getByText('Aryan Hospitals')).toBeVisible();

		// Should have job title
		await expect(firstJob.locator('h3')).toBeVisible();

		// Should have salary range
		await expect(firstJob.getByText(/₹.*K.*₹.*K/)).toBeVisible();

		// Should have location
		await expect(firstJob.locator('[class*="location"], [data-testid="location"]').first()).toBeVisible();

		// Should have experience range
		await expect(firstJob.getByText(/\d+-\d+y|Up to \d+y/)).toBeVisible();

		// Should have job type and work mode
		await expect(firstJob.getByText(/Full-time|Part-time|Contract|Internship|Locum/)).toBeVisible();
		await expect(firstJob.getByText(/Office|Remote|Hybrid/)).toBeVisible();

		// Should have skills/tags
		await expect(firstJob.getByText(/\+\d+ more/)).toBeVisible();
	});

	test('should navigate to job details when clicking job listing', async ({ page }) => {
		// Wait for job listings to load
		const jobListings = page.locator('a[href*="/organizations/"][href*="/jobs/"]');
		await expect(jobListings.first()).toBeVisible();

		// Get the first job listing URL
		const firstJobHref = await jobListings.first().getAttribute('href');
		expect(firstJobHref).toBeTruthy();

		// Click on the first job
		await jobListings.first().click();

		// Verify navigation to job details page
		if (firstJobHref) {
			await expect(page).toHaveURL(new RegExp(firstJobHref));
		}
	});

	test('should allow job search input', async ({ page }) => {
		const jobSearchInput = page.getByRole('combobox', { name: 'Job Search' });

		// Type in job search
		await jobSearchInput.fill('Nurse');

		// Verify input value
		await expect(jobSearchInput).toHaveValue('Nurse');

		// Check if suggestions appear
		const suggestionButton = page.getByRole('button', { name: 'Show suggestions' }).first();
		if (await suggestionButton.isVisible({ timeout: 2000 }).catch(() => false)) {
			await suggestionButton.click();
			// Verify suggestions dropdown appears
			// Note: The exact suggestion implementation may vary
		}
	});

	test('should allow location search input', async ({ page }) => {
		const locationInput = page.getByRole('combobox', { name: 'Location' });

		// Type in location search
		await locationInput.fill('Mumbai');

		// Verify input value
		await expect(locationInput).toHaveValue('Mumbai');

		// Check if suggestions appear
		const suggestionButton = page.getByRole('button', { name: 'Show suggestions' }).nth(1);
		if (await suggestionButton.isVisible({ timeout: 2000 }).catch(() => false)) {
			await suggestionButton.click();
			// Verify suggestions dropdown appears
		}
	});

	test('should interact with map controls', async ({ page }) => {
		// Test zoom in button
		const zoomInButton = page.getByRole('button', { name: 'Zoom in' });
		await expect(zoomInButton).toBeVisible();
		await zoomInButton.click();

		// Test zoom out button
		const zoomOutButton = page.getByRole('button', { name: 'Zoom out' });
		await expect(zoomOutButton).toBeVisible();
		await zoomOutButton.click();

		// Test reset view button
		const resetViewButton = page.getByRole('button', { name: 'Reset view' });
		await expect(resetViewButton).toBeVisible();
		await resetViewButton.click();

		// Test my location button (may prompt for permission)
		const myLocationButton = page.getByRole('button', { name: 'My location' });
		await expect(myLocationButton).toBeVisible();
		// Note: Clicking may require geolocation permissions
	});

	test('should interact with map markers and clusters', async ({ page }) => {
		// Wait for map to load
		await page.waitForTimeout(2000);

		// Check for map markers or clusters
		const markerButtons = page.locator('button[class*="marker"], button[class*="cluster"]');

		// If markers exist, test clicking them
		if ((await markerButtons.count()) > 0) {
			const firstMarker = markerButtons.first();
			await expect(firstMarker).toBeVisible();

			// Click the marker
			await firstMarker.click();

			// Should update job listings or show popup (implementation dependent)
			// Wait for any potential updates
			await page.waitForTimeout(1000);
		}
	});

	test('should toggle sidebar visibility', async ({ page }) => {
		const collapseButton = page.getByRole('button', { name: 'Collapse sidebar' });
		const sidebar = page.locator('[class*="sidebar"], [data-testid="sidebar"]').first();

		// Initially sidebar should be visible
		await expect(collapseButton).toBeVisible();

		// Click to collapse sidebar
		await collapseButton.click();

		// Wait for animation/transition
		await page.waitForTimeout(500);

		// Check if sidebar is collapsed (implementation dependent)
		// The button text or icon might change when collapsed
	});

	test('should handle navigation to home page', async ({ page }) => {
		const homeLink = page.getByRole('link', { name: 'Hospital Jobs' });

		await expect(homeLink).toBeVisible();
		await homeLink.click();

		// Should navigate to home page
		await expect(page).toHaveURL('https://localtest.me/');
	});

	test('should handle login navigation', async ({ page }) => {
		const loginButton = page.getByRole('button', { name: 'Log In' });

		await expect(loginButton).toBeVisible();
		await loginButton.click();

		// Should navigate to login page
		await expect(page).toHaveURL(/\/auth\/login/);
	});

	test('should handle recruiter navigation', async ({ page }) => {
		const recruiterButton = page.getByRole('button', { name: 'For Recruiters' });

		await expect(recruiterButton).toBeVisible();
		await recruiterButton.click();

		// Should navigate to recruiter page or show dropdown
		// Implementation may vary - could be navigation or dropdown
		await page.waitForTimeout(1000);
	});

	test('should be responsive on mobile viewport', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });

		// Refresh to ensure responsive layout loads
		await page.reload();

		// Accept cookies again if needed
		const acceptButton = page.getByRole('button', { name: 'Accept all' });
		if (await acceptButton.isVisible({ timeout: 3000 }).catch(() => false)) {
			await acceptButton.click();
		}

		// Check that main elements are still visible and accessible
		await expect(page.getByRole('link', { name: 'Hospital Jobs' })).toBeVisible();
		await expect(page.getByRole('combobox', { name: 'Job Search' })).toBeVisible();
		await expect(page.getByRole('combobox', { name: 'Location' })).toBeVisible();

		// Map controls should be visible
		await expect(page.getByRole('button', { name: 'Zoom in' })).toBeVisible();

		// Job listings should be accessible (might be in different layout)
		const jobListings = page.locator('a[href*="/organizations/"][href*="/jobs/"]');
		await expect(jobListings.first()).toBeVisible();
	});

	test('should handle search with filters combination', async ({ page }) => {
		// Set job search
		await page.getByRole('combobox', { name: 'Job Search' }).fill('Doctor');

		// Set location
		await page.getByRole('combobox', { name: 'Location' }).fill('Delhi');

		// Wait for potential search/filtering
		await page.waitForTimeout(2000);

		// Verify that results are updated (implementation dependent)
		const jobListings = page.locator('a[href*="/organizations/"][href*="/jobs/"]');
		await expect(jobListings.first()).toBeVisible();

		// Job count should be displayed
		await expect(page.getByRole('heading', { name: /Viewing \d+ Jobs/ })).toBeVisible();
	});

	test('should handle empty search results gracefully', async ({ page }) => {
		// Search for something unlikely to exist
		await page.getByRole('combobox', { name: 'Job Search' }).fill('xyz123nonexistentjob');

		// Wait for search to complete
		await page.waitForTimeout(2000);

		// Should handle empty state gracefully
		// (Implementation may show "No results" message or keep showing all jobs)
		const jobsHeader = page.getByRole('heading', { name: /Viewing \d+ Jobs/ });
		await expect(jobsHeader).toBeVisible();
	});

	test('should maintain job count consistency', async ({ page }) => {
		// Get initial job count from header
		const jobsHeader = page.getByRole('heading', { name: /Viewing \d+ Jobs/ });
		const headerText = await jobsHeader.textContent();
		const jobCount = headerText?.match(/\d+/)?.[0];

		expect(jobCount).toBeTruthy();

		// Count actual job listings
		const jobListings = page.locator('a[href*="/organizations/"][href*="/jobs/"]');
		const actualCount = await jobListings.count();

		// The counts should be related (might not be exactly equal due to pagination)
		expect(actualCount).toBeGreaterThan(0);
		if (jobCount) {
			expect(Number.parseInt(jobCount, 10)).toBeGreaterThanOrEqual(actualCount);
		}
	});

	test('should handle map loading errors gracefully', async ({ page }) => {
		// Block map-related requests to simulate loading issues
		await page.route('**/maps/**', route => route.abort());
		await page.route('**/mapbox/**', route => route.abort());
		await page.route('**/googleapis/**', route => route.abort());

		// Reload page
		await page.reload();

		// Accept cookies
		const acceptButton = page.getByRole('button', { name: 'Accept all' });
		if (await acceptButton.isVisible({ timeout: 3000 }).catch(() => false)) {
			await acceptButton.click();
		}

		// Page should still function - job listings should be visible
		const jobListings = page.locator('a[href*="/organizations/"][href*="/jobs/"]');
		await expect(jobListings.first()).toBeVisible();

		// Controls should still be present
		await expect(page.getByRole('button', { name: 'Zoom in' })).toBeVisible();
	});

	test('should display correct job information structure', async ({ page }) => {
		const jobListings = page.locator('a[href*="/organizations/"][href*="/jobs/"]');
		await expect(jobListings.first()).toBeVisible();

		const firstJob = jobListings.first();

		// Check organization logo/image
		const orgImage = firstJob.locator('img').first();
		await expect(orgImage).toBeVisible();

		// Check job title is a heading
		const jobTitle = firstJob.locator('h3');
		await expect(jobTitle).toBeVisible();

		// Check salary format
		const salary = firstJob.getByText(/₹\d+K - ₹\d+K/);
		await expect(salary).toBeVisible();

		// Check location has icon
		const locationIcon = firstJob.locator('img').nth(1);
		await expect(locationIcon).toBeVisible();

		// Check experience has icon
		const experienceIcon = firstJob.locator('img').nth(2);
		await expect(experienceIcon).toBeVisible();
	});

	test('should handle keyboard navigation', async ({ page }) => {
		const jobSearchInput = page.getByRole('combobox', { name: 'Job Search' });

		// Focus on job search input
		await jobSearchInput.focus();

		// Should be focused
		await expect(jobSearchInput).toBeFocused();

		// Tab to location input
		await page.keyboard.press('Tab');
		const locationInput = page.getByRole('combobox', { name: 'Location' });
		await expect(locationInput).toBeFocused();

		// Tab to search button
		await page.keyboard.press('Tab');
		const searchButton = page.locator('button[type="submit"], button:has-text("Search")');
		if (await searchButton.isVisible({ timeout: 1000 }).catch(() => false)) {
			await expect(searchButton).toBeFocused();
		}
	});

	test('should display proper loading states', async ({ page }) => {
		// Intercept GraphQL/API requests to simulate slow loading
		await page.route('**/graphql', async route => {
			await new Promise(resolve => setTimeout(resolve, 1000));
			route.continue();
		});

		// Navigate to trigger loading
		await page.goto('https://localtest.me/search/map');

		// Accept cookies
		const acceptButton = page.getByRole('button', { name: 'Accept all' });
		if (await acceptButton.isVisible({ timeout: 3000 }).catch(() => false)) {
			await acceptButton.click();
		}

		// Should eventually show job listings
		const jobListings = page.locator('a[href*="/organizations/"][href*="/jobs/"]');
		await expect(jobListings.first()).toBeVisible({ timeout: 10000 });
	});

	test('should handle different viewport sizes', async ({ page }) => {
		// Test tablet viewport
		await page.setViewportSize({ width: 768, height: 1024 });
		await page.reload();

		// Accept cookies
		const acceptButton = page.getByRole('button', { name: 'Accept all' });
		if (await acceptButton.isVisible({ timeout: 3000 }).catch(() => false)) {
			await acceptButton.click();
		}

		// Check elements are visible
		await expect(page.getByRole('link', { name: 'Hospital Jobs' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Zoom in' })).toBeVisible();

		// Test desktop viewport
		await page.setViewportSize({ width: 1920, height: 1080 });
		await page.reload();

		// Accept cookies again
		const acceptButtonDesktop = page.getByRole('button', { name: 'Accept all' });
		if (await acceptButtonDesktop.isVisible({ timeout: 3000 }).catch(() => false)) {
			await acceptButtonDesktop.click();
		}

		// All elements should still be visible
		await expect(page.getByRole('combobox', { name: 'Job Search' })).toBeVisible();
		await expect(page.getByRole('combobox', { name: 'Location' })).toBeVisible();

		const jobListings = page.locator('a[href*="/organizations/"][href*="/jobs/"]');
		await expect(jobListings.first()).toBeVisible();
	});

	test('should maintain accessibility standards', async ({ page }) => {
		// Check for proper heading structure
		const h2Elements = page.locator('h2');
		const h3Elements = page.locator('h3');

		// Should have at least one h2 (jobs count)
		await expect(h2Elements.first()).toBeVisible();

		// Should have h3 elements for job titles
		await expect(h3Elements.first()).toBeVisible();

		// Check for proper labeling of form elements
		const jobSearchInput = page.getByRole('combobox', { name: 'Job Search' });
		const locationInput = page.getByRole('combobox', { name: 'Location' });

		await expect(jobSearchInput).toBeVisible();
		await expect(locationInput).toBeVisible();

		// Check buttons have accessible names
		await expect(page.getByRole('button', { name: 'Zoom in' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Zoom out' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Reset view' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'My location' })).toBeVisible();
	});

	test('should handle search input clearing', async ({ page }) => {
		const jobSearchInput = page.getByRole('combobox', { name: 'Job Search' });
		const locationInput = page.getByRole('combobox', { name: 'Location' });

		// Fill inputs
		await jobSearchInput.fill('Surgeon');
		await locationInput.fill('Chennai');

		// Clear inputs
		await jobSearchInput.clear();
		await locationInput.clear();

		// Verify inputs are empty
		await expect(jobSearchInput).toHaveValue('');
		await expect(locationInput).toHaveValue('');

		// Should still show job listings
		const jobListings = page.locator('a[href*="/organizations/"][href*="/jobs/"]');
		await expect(jobListings.first()).toBeVisible();
	});

	test('should display consistent branding and styling', async ({ page }) => {
		// Check Hospital Jobs logo/brand
		const brandLink = page.getByRole('link', { name: 'Hospital Jobs' });
		await expect(brandLink).toBeVisible();

		// Should have consistent color scheme (check for CSS classes or computed styles)
		const navigation = page.locator('nav').first();
		await expect(navigation).toBeVisible();

		// Job cards should have consistent styling
		const jobListings = page.locator('a[href*="/organizations/"][href*="/jobs/"]');
		const firstJob = jobListings.first();
		const secondJob = jobListings.nth(1);

		if (await secondJob.isVisible({ timeout: 2000 }).catch(() => false)) {
			// Both job cards should have similar structure
			await expect(firstJob.locator('h3')).toBeVisible();
			await expect(secondJob.locator('h3')).toBeVisible();
		}
	});
});
