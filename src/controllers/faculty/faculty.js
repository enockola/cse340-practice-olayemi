import { getFacultyById, getSortedFaculty } from '../../models/faculty/faculty.js';

export const facultyListPage = (req, res) => {
  const sortBy = req.query.sort || 'department';
  const facultyList = getSortedFaculty(sortBy);

  res.render('faculty/list', {
    title: 'Faculty Directory',
    faculty: facultyList,
    currentSort: sortBy
  });
};

export const facultyDetailPage = (req, res, next) => {
  const facultyId = req.params.facultyId;
  const member = getFacultyById(facultyId);

  if (!member) {
    const err = new Error(`Faculty member '${facultyId}' not found`);
    err.status = 404;
    return next(err);
  }

  res.render('faculty/detail', {
    title: member.name,
    faculty: member
  });
};
